import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentDashboard.css';

function StudentDashboard() {
    const [studentInfo, setStudentInfo] = useState(null);
    const [registeredExams, setRegisteredExams] = useState([]);
    const [examPerformance, setExamPerformance] = useState([]);
    const navigate = useNavigate();

    // Fetch student info, registered exams, and exam performance on component mount
    useEffect(() => {
        fetchStudentInfo();
        fetchRegisteredExams();
        //fetchExamPerformance();
    }, []);

    const fetchStudentInfo = async () => {
        try {
            const response = await axios.get('http://localhost:3001/get-user-info', {
                withCredentials: true, // Necessary for cookies to be sent or for passing along auth headers
            });
            const responseData = response.data;
            if (responseData.status === 'success') {
                setStudentInfo(responseData.user);
            } else {
                console.error('Failed to fetch user info');
            }
        } catch (error) {
            console.error('There was an error fetching user info!', error);
        }
    };

    const fetchRegisteredExams= async()=>{
        try{
            const response = await axios.get('http://localhost:3001/registered-exams', {
                withCredentials: true
            });
            const responseData = response.data;
            if (responseData.status === 'success') {
                setRegisteredExams(responseData.exams); // Assuming the response has an exams field
            } else {
                console.error('Failed to fetch registered exams');
            }

        }catch(error){
            console.error('There was an error fetching registered exams: ',error);
        }
    }

    const navigateToExam = async () => {
        try {
           navigate('/examList');
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    const navigateToPerformance= async () => {
        navigate(`/performance`); // Adjust the route as needed
    };

    const navigateToReview= async () => {
        navigate('/review')
    };

    const handleStartExam = async (examId) => {
        try {
          const response = await axios.post('http://localhost:3001/start-exam', { examId }, { withCredentials: true });
          const responseData = await response.data;
          if (responseData.status === 'success') {
            // Redirect to the ExamPage component with the exam details passed as state
            navigate(`/exam/${examId}`, { state: { examDetails: responseData.exam } });
          } else {
            console.error('Failed to start exam');
          }
        } catch (error) {
          console.error('There was an error starting the exam:', error);
        }
      };
      

    const handleCancelRegistration= async (examId) => {
        //console.log(examId);
        try{
            const response = await axios.delete(`http://localhost:3001/cancelRegistration/${examId}`,
                {withCredentials: true}
            );
            if (response.data.status==='success'){
                alert('Exam registration cancelled successfully!');
                fetchRegisteredExams();
            }
            else{
                alert('Failed to cancel the registration.')
            }
        }
        catch(error){
            console.error('There was an error cancelling the registration:',error);
            alert('An error occurred. Please try again later.')
        };
    };

    const handleLogout = async () => {
        try {
            // Implement logout logic, typically a fetch request to your backend
            navigate('/'); // Redirect to login page after successful logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="student-dashboard">
            <div className="navbar">
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div className="student-info">
                {studentInfo ? (
                    <>
                        <h2>Student Information</h2>
                        <p>Name: {studentInfo.name}</p>
                        <p>Email: {studentInfo.email}</p>
                    </>
                ) : (
                    <p>Loading student information...</p>
                )}
                <div className="actions">
                <button onClick={navigateToExam}>Register for Exam</button>
                <button onClick={navigateToPerformance}>View Performance</button>
                <button onClick={navigateToReview}>Exam Review</button>
            </div>
            </div>
            
            <div className="registered-exams">
                <h2>Registered Exams</h2>
                {registeredExams.length > 0 ? (
                    <ul>
                        {registeredExams.map((exam, index) => (
                            <li key={index}>
                                <p>Exam ID: {exam.exam_id}</p>
                                <p>Subject: {exam.subject}</p>
                                <p>Date: {exam.exam_date}</p>
                                <p>Exam duration: {exam.exam_duration}</p>
                                <p>Total Marks: {exam.total_marks}</p>
                                <p>Fees: {exam.fees}</p>
                                <button onClick={() => handleStartExam(exam.exam_id)}>Start Exam</button>
                                <button onClick={() => handleCancelRegistration(exam.exam_id)}>Cancel Registration</button> 
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No exams registered.</p>
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;
