import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Typography, Spin } from 'antd';
//import 'antd/dist/antd.css'; // Ensure to import Ant Design CSS

const { Title, Text } = Typography;

function PerformanceReview() {
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/performance`, { withCredentials: true });
        setPerformanceData(groupByExamId(response.data.performanceData));
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchPerformanceData();
  }, []);

  // Helper function to group performance data by exam ID
  const groupByExamId = (data) => {
    return data.reduce((grouped, item) => {
      (grouped[item.exam_id] = grouped[item.exam_id] || []).push(item);
      return grouped;
    }, {});
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Performance Review</Title>
      {performanceData ? (
        Object.entries(performanceData).map(([examId, examDetails]) => (
          <Card key={examId} title={`Exam ID: ${examId}`} style={{ marginBottom: '20px' }}>
            <Row gutter={16}>
              {examDetails.map(detail => (
                <Col span={8} key={`${examId}_${detail.difficulty_level}`}>
                  <Card type="inner" title={`Difficulty Level: ${detail.difficulty_level}`}>
                    <Text>Questions Answered: {detail.questions_answered}</Text><br />
                    <Text>Correctly Answered: {detail.correct_answers}</Text><br />
                    <Text>Incorrectly Answered: {detail.incorrect_answers}</Text><br />
                    <Text>Average Time Taken: {parseFloat(detail.average_time).toFixed(2)} seconds</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        ))
      ) : (
        <Spin size="large" />
      )}
    </div>
  );
}

export default PerformanceReview;
