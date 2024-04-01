import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Performance.css';

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
    <div>
      <h1>Performance Review</h1>
      <div className="exam-container"> {/* Add this wrapper for CSS grid */}
      {performanceData ? (
        Object.entries(performanceData).map(([examId, examDetails]) => (
          <div key={examId} className='exam-box'>
            <h2>Exam ID: {examId}</h2>
            {examDetails.map(detail => (
              <div key={`${examId}_${detail.difficulty_level}`} className='detail-box'>
                <h3>Difficulty Level: {detail.difficulty_level}</h3>
                <p>Questions Answered: {detail.questions_answered}</p>
                <p>Correctly Answered: {detail.correct_answers}</p>
                <p>Incorrectly Answered: {detail.incorrect_answers}</p>
                <p>Average Time Taken: {parseFloat(detail.average_time).toFixed(2)} seconds</p>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Loading performance data...</p>
      )}
      </div> {/* Close the exam-container div */}
    </div>
  );
}

export default PerformanceReview;
