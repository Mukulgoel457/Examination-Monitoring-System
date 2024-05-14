import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { List, Button, Typography, Card, message } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;

function ExamList() {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await axios.get('http://localhost:3001/examList', { withCredentials: true });
            if (response.data.status === 'success') {
                setExams(response.data.exams);
            } else {
                message.error('Failed to load exams');
            }
        } catch (error) {
            message.error('There was an error fetching the exams: ' + error.message);
        }
    };

    const registerForExam = async (examId) => {
        try {
            const response = await axios.post(`http://localhost:3001/registerForExam/${examId}`, {}, { withCredentials: true });
            if (response.data.status === 'success') {
                message.success('Registered for exam successfully!');
                fetchExams(); // Refresh the exam list
            } else {
                message.error('Failed to register for the exam.');
            }
        } catch (error) {
            message.error('There was an error registering for the exam: ' + error.message);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <Title level={1}>Available Exams</Title>
            <List
                itemLayout="vertical"
                dataSource={exams}
                renderItem={exam => (
                    <List.Item key={exam.exam_id}>
                        <Card title={`${exam.exam_id} - ${exam.subject}`}>
                            <Text>Date: {moment(exam.exam_date).format('DD-MM-YY')}</Text><br />
                            <Text>Total Marks: {exam.total_marks}</Text><br />
                            <Text>Exam Duration: {exam.exam_duration}</Text><br />
                            <Text>Fees: {exam.fees}</Text><br />
                            {exam.isRegistered ? (
                                <Text style={{ color: 'blue', fontWeight: 'bold' }}>You are already registered for this exam.</Text>
                            ) : (
                                <Button type="primary" onClick={() => registerForExam(exam.exam_id)}>
                                    Register
                                </Button>
                            )}
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default ExamList;
