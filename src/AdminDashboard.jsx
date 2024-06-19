import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Input, Form, Select } from 'antd';
//import 'antd/dist/antd.css'; // Import AntD stylesheet
import './index.css'; // Make sure your custom styles don't conflict

function AdminDashboard() {
    const [adminInfo, setAdminInfo] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAdminInfo();
    }, []);

    const fetchAdminInfo = async () => {
        try {
            const response = await axios.get('http://localhost:3001/get-user-info', {
                withCredentials: true,
            });
            if (response.data.status === 'success') {
                setAdminInfo(response.data.user);
            } else {
                console.error('Failed to fetch user info');
            }
        } catch (error) {
            console.error('There was an error fetching user info!', error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:3001/exams', values, {
                withCredentials: true,
            });
            if (response.data.status === 'success') {
                console.log('Exam registered successfully');
                Modal.success({
                    title: 'Success',
                    content: 'Exam registered successfully!',
                });
                form.resetFields(); // Reset form after successful submission
            } else {
                console.error('Error registering new exam:', response.data.message);
                Modal.error({
                    title: 'Error',
                    content: `Error registering new exam: ${response.data.message}`,
                });
            }
        } catch (error) {
            console.error('Error registering new exam:', error);
            Modal.error({
                title: 'Error',
                content: 'Error registering new exam. Please try again.',
            });
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="navbar">
                <Button onClick={() => navigate('/')} type="primary">Logout</Button>
            </div>
            {adminInfo ? (
                <div className="admin-info">
                    <h2>Admin Profile</h2>
                    <p>Name: {adminInfo.name}</p>
                    <p>Email: {adminInfo.email}</p>
                </div>
            ) : (
                <p>Loading admin information...</p>
            )}
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="new-exam-form"
                requiredMark={false}
            >
                <Form.Item name="examId" label="Exam ID" rules={[{ required: true }]}>
                    <Input placeholder="Enter Exam ID" />
                </Form.Item>
                <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
                    <Input placeholder="Enter Subject" />
                </Form.Item>
                <Form.Item name="examDate" label="Exam Date" rules={[{ required: true }]}>
                    <Input type="date" />
                </Form.Item>
                <Form.Item name="examDuration" label="Exam Duration" rules={[{ required: true }]}>
                    <Input placeholder="e.g., '2 hours'" />
                </Form.Item>
                <Form.Item name="numberOfQuestions" label="Number of Questions" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="totalMarks" label="Total Marks" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="fees" label="Fees" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Set Questions
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AdminDashboard;
