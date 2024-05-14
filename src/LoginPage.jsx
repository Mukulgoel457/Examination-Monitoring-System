import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select } from 'antd';  // Import necessary components from antd
import './index.css';  // Ensure your CSS file for additional styles

const { Option } = Select;

function LoginPage() {
    const [credentials, setCredentials] = useState({
        name: '',
        username: '',
        password: '',
        role: 'Student', // Default role
    });
    const navigate = useNavigate();

    const handleChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3001/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // For CORS and sending cookies
                body: JSON.stringify(credentials)
            });

            const responseData = await response.json();
            console.log('Login response:', responseData);
            if (responseData.message === 'Login successful') {
                navigate(`/dashboard/${credentials.role.toLowerCase()}`);
            } else {
                console.error('Login failed:', responseData.message);
            }
        } catch (error) {
            console.error('There was an error logging in:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-green-300 animate-pulse">
            <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md animate-scale-in-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Login</h2>
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                        <Input onChange={e => handleChange('name', e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input onChange={e => handleChange('email', e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                        <Input.Password onChange={e => handleChange('password', e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                        <Select initialvalues="Student" onChange={value => handleChange('role', value)}>
                            <Option value="Student">Student</Option>
                            <Option value="Admin">Admin</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Login</Button>
                    </Form.Item>
                </Form>
                <Button type="link" onClick={() => navigate('/register')}>Don't have an account? Register Now</Button>
            </div>
        </div>
    );
}

export default LoginPage;
