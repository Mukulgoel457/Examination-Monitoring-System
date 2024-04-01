import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExamReview.css';

function ExamReview() {
  const [registeredExams, setRegisteredExams] = useState([]); // Store registered exams
  const [reviewData, setReviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch registered exams on component mount
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

  // Function to fetch review data for a specific exam
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

  // Function to handle button click for a specific exam
  const handleReviewButtonClick = (examId) => {
    fetchReviewData(examId); // Fetch review data for the new exam ID
  };

  return (
    <div className='exam-review-container'>
      <h1>Exam Review</h1>
      {registeredExams.map((exam) => (
        <button key={exam.exam_id} onClick={() => handleReviewButtonClick(exam.exam_id)}>
          Show Review for {exam.subject}
        </button>
      ))}

      {isLoading ? (
        <div className='loading-div'>Loading exam review...</div>
      ) : (
        <div className='review-content'>
          {reviewData.length > 0 ? (
            <>
              <h2>Exam Review Details</h2>
              <ul>
                {reviewData.map((item, index) => (
                  <li key={index}>
                    <h3>Question: {item.question}</h3>
                    <p>Your Answer: {item.selectedOption}</p>
                    <p>Correct Answer: {item.correctOption}</p>
                    <p>{item.isCorrect ? 'Correct' : 'Incorrect'}</p>
                    <p>Time Taken: {item.timeTaken} seconds.</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No review data available for this exam.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ExamReview;