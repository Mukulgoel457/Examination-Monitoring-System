import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Spin, List, Card, Typography } from 'antd';
//import 'antd/dist/antd.css'; // Ensure to import Ant Design CSS

const { Title, Text } = Typography;

function ExamReview() {
  const [registeredExams, setRegisteredExams] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRegisteredExams = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/registered-exams', { withCredentials: true });
        setRegisteredExams(response.data.exams); // Assuming response structure
      } catch (error) {
        console.error('Error fetching registered exams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegisteredExams();
  }, []);

  const fetchReviewData = async (examId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/exam-review/${examId}`, { withCredentials: true });
      setReviewData(response.data.reviewData);
    } catch (error) {
      console.error('Error fetching review data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewButtonClick = (examId) => {
    fetchReviewData(examId);
  };

  return (
    <div className='exam-review-container' style={{ padding: 24 }}>
      <Title level={1}>Exam Review</Title>
      {isLoading && <Spin size="large" />}

      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={registeredExams}
        renderItem={exam => (
          <List.Item>
            <Button type="primary" onClick={() => handleReviewButtonClick(exam.exam_id)}>
              Show Review for {exam.subject}
            </Button>
          </List.Item>
        )}
      />

      {!isLoading && reviewData.length > 0 ? (
        <Card title="Exam Review Details">
          <List
            dataSource={reviewData}
            renderItem={item => (
              <List.Item>
                <Card type="inner" title={`Question: ${item.question}`}>
                  <Text>Your Answer: {item.selectedOption}</Text><br />
                  <Text>Correct Answer: {item.correctOption}</Text><br />
                  <Text style={item.isCorrect ? { color: 'green', fontWeight: 'bold' } : { color: 'red', fontWeight: 'bold' }}>
                    {item.isCorrect ? 'Correct' : 'Incorrect'}
                  </Text><br />
                  <Text>Time Taken: {item.timeTaken} seconds.</Text>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      ) : (
        !isLoading && <Text>No review data available for this exam.</Text>
      )}
    </div>
  );
}

export default ExamReview;
