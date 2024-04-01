import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './ExamPage.css';

const initialQuestion = {
  qid: null,
  qcontent: "Loading your first question...",
  qoptions: [],
  correct_option_id: null,
  difficulty_level: 1
};

function ExamPage() {
  const [examDetails, setExamDetails] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [selectedOption, setSelectedOption] = useState(null);
  const [responses, setResponses] = useState([]);
  const [timer, setTimer] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState(2);
  const navigate = useNavigate();
  const { examId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission status
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const [displayedQuestions, setDisplayedQuestions] = useState(new Set());
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false); // New state to track if the exam is completed


  useEffect(() => {
    fetchExamDetails();
    // The fetchNextQuestion will be called after fetching exam details
  }, []);
  const allQuestionsAnswered = responses.length >= examDetails.number_of_questions;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer > 0 ? prevTimer - 1 : 0);
      if (timer === 1) {
        setExamCompleted(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (responses.length >= examDetails.number_of_questions) {
      setExamCompleted(true);
    }
  }, [responses, examDetails]);

  const fetchExamDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/exam-details/${examId}`, { withCredentials: true });
      if (response.data.status === 'success') {
        setExamDetails(response.data.examDetails);
        const [hours, minutes, seconds] = response.data.examDetails.exam_duration.split(':').map(Number);
        const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
        setTimer(totalSeconds); // Set timer based on total seconds calculated        
        fetchNextQuestion(); // fetch the first question after getting exam details
        
      }
    } catch (error) {
      console.error('There was an error fetching exam details:', error);
    }
  };

  useEffect(() => {
    if (responses.length === examDetails.number_of_questions - 1) {
      setShowSubmitWarning(true);
      const warningTimer = setTimeout(() => {
        setShowSubmitWarning(false);
      }, 5000); // Show warning for 5 seconds
      return () => clearTimeout(warningTimer);
    }
  }, [responses, examDetails.number_of_questions]);

  const fetchNextQuestion = async (answeredCorrectly = null) => {
    if (examCompleted) return;
  
    let nextDifficulty = currentDifficulty;
    if (answeredCorrectly !== null) {
      nextDifficulty = answeredCorrectly ? Math.min(currentDifficulty + 1, 5) : Math.max(currentDifficulty - 1, 1);
    }
  
    const url = `http://localhost:3001/get-exam-questions/${examId}/${nextDifficulty}`;
  
    try {
      const response = await axios.get(url, { withCredentials: true });
      if (response.data.status === 'success') {
        const questionData = response.data.question;
  
        // Now we check if the question has already been displayed after we're sure questionData is defined
        if (!displayedQuestions.has(questionData.qid)) {
          setCurrentQuestion({
            ...questionData,
            qoptions: JSON.parse(questionData.qoptions)
          });
          setDisplayedQuestions(prev => new Set(prev).add(questionData.qid));
          setCurrentDifficulty(nextDifficulty); // Update difficulty for next question
          setQuestionStartTime(Date.now()); // Record the start time for the new question
        } else {
          // If already displayed, recursively fetch another question
          fetchNextQuestion(answeredCorrectly);
        }
      }
    } catch (error) {
      console.error('Fetching questions failed', error);
    }
  };
  
  

  const handleOptionChange = optionId => {
    setSelectedOption(optionId);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Lock the submit button
  
    const isCorrect = selectedOption === currentQuestion.correct_option_id;
    const endTime = Date.now();
    const timeTaken = endTime - questionStartTime; // Calculate time taken in milliseconds
    // Response object to send to the backend
    const response = {
      examId: examDetails.exam_id,
      questionId: currentQuestion.qid,
      selectedOption: selectedOption,
      isCorrect: isCorrect,
      timeTaken:timeTaken/1000
    };
  
    try {
      await axios.post(`http://localhost:3001/submit-answer`, response, { withCredentials: true });
      console.log('Response submitted successfully for question:', response.questionId);
      setResponses(prevResponses => [...prevResponses, response]); // Update the responses state
      const nextDifficulty = isCorrect ? Math.min(currentDifficulty + 1, 5) : Math.max(currentDifficulty - 1, 1);
      setCurrentDifficulty(nextDifficulty);
      if (responses.length + 1 < examDetails.number_of_questions) {
        // Fetch next question only if we haven't reached the last question
        fetchNextQuestion(isCorrect);
      } else {
        // Otherwise, mark the exam as completed
        setExamCompleted(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false); // Unlock the submit button regardless of success or error
    }
  };
  
  useEffect(() => {
    if (examCompleted) {
      // Call any additional logic if needed when the exam is completed
      submitExam();
    }
  }, [examCompleted]); // Only re-run the effect if examCompleted changes
  
  const submitExam = async () => {
    //const studentId = getStudentIdFromSession();
    const finalScore = responses.filter(response => response.isCorrect).length; // Count the number of correct answers
    
    // Construct the POST request payload
    const examData = {
      examId: examDetails.exam_id,
      //studentId: studentId,
      finalScore: finalScore,
    };
  
    // Make a POST request to submit the exam data
    try {
      await axios.post(`http://localhost:3001/submit-exam`, examData, { withCredentials: true });
      alert(`Exam submitted successfully. Your score: ${finalScore}`);
      navigate('/dashboard/student');
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  };
  

  return (
    <div className="exam-page">
      <div className="exam-header">
      {showSubmitWarning && (
          <div className="submit-warning">
            <p>Get ready to submit the exam!</p>
          </div>
        )}
        <h1>Exam: {examDetails.subject}</h1>
        <p>No. of Questions: {examDetails.number_of_questions}</p>
        <div className="timer">
          {`${Math.floor(timer / 3600).toString().padStart(2, '0')}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
        </div>
      </div>
      {currentQuestion && (
        <div className="question-container">
          <h2>Question: {currentQuestion.qcontent}</h2>
          <ul className="options-list">
            {currentQuestion.qoptions.map(option => (
              <li key={option.id}>
                <label>
                  <input
                    type="radio"
                    name="question-option"
                    checked={selectedOption === option.id}
                    onChange={() => handleOptionChange(option.id)}
                  />
                  {option.text}
                </label>
              </li>
            ))}
          </ul>
          <button className="submit-answer-btn" onClick={submitAnswer} disabled={isSubmitting}>
            Submit Answer
          </button>
        </div>
      )}
      {!examCompleted && !currentQuestion.qcontent && <p>Loading questions...</p>}
      {examCompleted && (
        <div className="submit-exam-container">
          <button className="submit-exam-btn" onClick={submitExam}>
            Submit Exam
          </button>
        </div>
      )}
    </div>
  );  
}

export default ExamPage;
