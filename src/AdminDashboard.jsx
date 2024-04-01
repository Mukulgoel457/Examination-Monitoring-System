import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
    const [adminInfo, setAdminInfo] = useState(null);
    const [newExam, setNewExam] = useState({
        examId: '',
        subject: '',
        examDate: '',
        totalMarks: '',
        fees: '',
        numberOfQuestions: '',
        examDuration: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchAdminInfo();
    }, []);

    const fetchAdminInfo = async () => {
        // Fetch admin info logic
        try {
            const response = await axios.get('http://localhost:3001/get-user-info', {
                withCredentials: true, // Necessary for cookies to be sent or for passing along auth headers
            });
            const responseData = response.data;
            if (responseData.status === 'success') {
                setAdminInfo(responseData.user);
            } else {
                console.error('Failed to fetch user info');
            }
        } catch (error) {
            console.error('There was an error fetching user info!', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewExam(prevState => ({ ...prevState, [name]: value }));
    };

    const resetForm = () => {
        setNewExam({
            examId: '',
            subject: '',
            examDate: '',
            totalMarks: '',
            fees: '',
            numberOfQuestions: '',
            examDuration: ''
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Send the new exam details to the server
            const response = await axios.post('http://localhost:3001/exams', newExam, {
                withCredentials: true,
            });
            
            // Check if the request was successful
            if (response.data.status === 'success') {
                // Provide a success message to the admin
                console.log('Exam registered successfully');
                alert('Exam registered successfully!');
                // Clear the form after successful registration
                setNewExam({
                    subject: '',
                    examDate: '',
                    totalMarks: '',
                    fees: '',
                    numberOfQuestions: '',
                    examDuration: ''
                });
                // Optionally, navigate to a different page, such as the exams list
                // navigate('/admin-exams-list');
            } else {
                // If the server responded with an error, alert the admin
                console.error('Error registering new exam:', response.data.message);
                alert('Error registering new exam: ' + response.data.message);
            }
        } catch (error) {
            // Handle errors if the server sends a non-2xx response or if there's a network issue
            console.error('Error registering new exam:', error);
            alert('Error registering new exam. Please try again.');
        }
    };

    const handleLogout = async () => {
        // Logout logic
	try {
            const response = await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
            const responseData = response.data;
            if (responseData.status === 'success') {
                navigate('/'); 
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="navbar">
                <button onClick={handleLogout}>Logout</button>
            </div>
            {adminInfo ? (
                <div className="admin-info">
                    <h2>Admin Profile</h2>
                    <p>Name: {adminInfo.name}</p>
                    <p>Email: {adminInfo.email}</p>
                </div>
            ) : (
                <div>Loading admin information...</div>
            )}
            <div className="new-exam-form">
                <h2>Register New Exam</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="examId" 
                        value={newExam.examId} 
                        onChange={handleInputChange}  
                        placeholder="Exam ID" 
                        required />
                    <input
                        type="text"
                        name="subject"
                        value={newExam.subject}
                        onChange={handleInputChange}
                        placeholder="Subject"
                        required />
                    <input
                        type="date"
                        name="examDate"
                        value={newExam.examDate}
                        onChange={handleInputChange}
                        placeholder="Exam Date"
                        required
                    />
                    <input
                    type="text"
                    name="examDuration"
                    value={newExam.examDuration}
                    onChange={handleInputChange}
                    placeholder="Exam Duration (e.g., '2 hours')"
                    required
                />
                    <input
                    type="number"
                    name="numberOfQuestions"
                    value={newExam.numberOfQuestions}
                    onChange={handleInputChange}
                    placeholder="Number of Questions"
                    required
                />
                    <input
                        type="number"
                        name="totalMarks"
                        value={newExam.totalMarks}
                        onChange={handleInputChange}
                        placeholder="Total Marks"
                        required
                    />
                    <input
                        type="number"
                        name="fees"
                        value={newExam.fees}
                        onChange={handleInputChange}
                        placeholder="Fees"
                        required
                    />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default AdminDashboard;
