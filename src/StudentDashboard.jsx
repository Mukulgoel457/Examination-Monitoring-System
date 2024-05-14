import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, List, Typography, Modal, message, Space } from 'antd';
import moment from 'moment';

const { Title } = Typography;

function StudentDashboard() {
    const [studentInfo, setStudentInfo] = useState(null);
    const [registeredExams, setRegisteredExams] = useState([]);
    const [completedExams, setCompletedExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentInfo();
        fetchExams();
    }, []);

    const fetchStudentInfo = async () => {
        try {
            const response = await axios.get('http://localhost:3001/get-user-info', { withCredentials: true });
            if (response.data.status === 'success') {
                setStudentInfo(response.data.user);
            } else {
                message.error('Failed to fetch user info');
            }
        } catch (error) {
            message.error('There was an error fetching user info!');
        }
    };

    const fetchExams = async () => {
        try {
            const [registeredResponse, completedResponse] = await Promise.all([
                axios.get('http://localhost:3001/registered-exams', { withCredentials: true }),
                axios.get('http://localhost:3001/completed-exams', { withCredentials: true })
            ]);
            if (registeredResponse.data.status === 'success') {
                setRegisteredExams(registeredResponse.data.exams);
            } else {
                message.error('Failed to fetch registered exams');
            }
            if (completedResponse.data.status === 'success') {
                setCompletedExams(completedResponse.data.exams);
            } else {
                message.error('Failed to load completed exams');
            }
        } catch (error) {
            message.error('There was an error fetching exams');
        }
    };

    const handleCancelRegistration = async (examId) => {
        Modal.confirm({
            title: 'Are you sure you want to cancel this registration?',
            onOk: async () => {
                try {
                    const response = await axios.delete(`http://localhost:3001/cancelRegistration/${examId}`, { withCredentials: true });
                    if (response.data.status === 'success') {
                        message.success('Exam registration cancelled successfully!');
                        fetchExams(); // Refresh the exam lists
                    } else {
                        message.error('Failed to cancel the registration.');
                    }
                } catch (error) {
                    message.error('There was an error cancelling the registration: ' + error.message);
                }
            },
        });
    };

    return (
        <div className="student-dashboard">
            <Card title="Student Information">
                {studentInfo ? (
                    <>
                        <Title level={4}>Name: {studentInfo.name}</Title>
                        <Title level={4}>Email: {studentInfo.email}</Title>
                        <Space>
                            <Button onClick={() => navigate('/')}>Logout</Button>
                            <Button onClick={() => navigate('/examList')}>Register for Exam</Button>
                            <Button onClick={() => navigate('/performance')}>View Performance</Button>
                            <Button onClick={() => navigate('/review')}>Exam Review</Button>
                        </Space>
                    </>
                ) : (
                    <p>Loading student information...</p>
                )}
            </Card>
            <Card title="Registered Exams">
                <List
                    itemLayout="horizontal"
                    dataSource={registeredExams.filter(exam => !completedExams.some(e => e.exam_id === exam.exam_id))}
                    renderItem={exam => (
                        <List.Item
                            actions={[
                                <Button key="start" type="primary" onClick={() => navigate(`/exam/${exam.exam_id}`)}>Start Exam</Button>,
                                <Button key="cancel" danger onClick={() => handleCancelRegistration(exam.exam_id)}>Cancel Registration</Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={exam.subject}
                                description={
                                    <>
                                        <h4>Exam ID: {exam.exam_id}</h4>
                                        <div>Exam on: {moment(exam.exam_date).format('DD-MM-YY')}</div>
                                        <div>Duration: {exam.exam_duration}</div>
                                        <div>Total Marks: {exam.total_marks}</div>
                                        <div>Fees: {exam.fees}</div>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
            <Card title="Completed Exams">
                <List
                    itemLayout="horizontal"
                    dataSource={completedExams}
                    renderItem={exam => (
                        <List.Item>
                            <List.Item.Meta
                                title={exam.subject}
                                description={
                                    <>
                                            <h4>{exam.exam_id}</h4>
                                            <div>Completed on {moment(exam.exam_date ? exam.exam_date : new Date()).format('DD-MM-YY')}</div>

                                    </>
                                    
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}

export default StudentDashboard;
