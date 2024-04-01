import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExamList.css';

function ExamList() {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await axios.get('http://localhost:3001/examList', {
                withCredentials: true,
            });
            if (response.data.status === 'success') {
                setExams(response.data.exams);
            } else {
                console.error('Failed to load exams');
            }
        } catch (error) {
            console.error('There was an error fetching the exams:', error);
        }
    };

    const registerForExam = async (examId) => {
        try {
            const response = await axios.post(`http://localhost:3001/registerForExam/${examId}`, {}, {
                withCredentials: true,
            });
            if (response.data.status === 'success') {
                alert('Registered for exam successfully!');
                fetchExams(); // Refresh the exam list
            } else {
                alert('Failed to register for the exam.');
            }
        } catch (error) {
            console.error('There was an error registering for the exam:', error);
        }
    };

    return (
        <div>
            <h1>Available Exams</h1>
            <ul>
                {exams.map((exam) => (
                    <li key={exam.exam_id}>
                        <div>
                            <h2>{exam.exam_id} - {exam.subject}</h2>
                            <p>Date: {exam.exam_date}</p>
                            <p>Total Marks: {exam.total_marks}</p>
                            <p>Exam Duration: {exam.exam_duration}</p>
                            <p>Fees: {exam.fees}</p>
                            {exam.isRegistered ? (
                                <p>You are already registered for this exam.</p>
                            ) : (
                                <button onClick={() => registerForExam(exam.exam_id)}>Register</button>
                            )}                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ExamList;
