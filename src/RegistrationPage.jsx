import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, notification } from 'antd';

function RegistrationPage() {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student',
        authCode: '',
    });

    const navigate = useNavigate();
    const { Option } = Select;

    // Define the correct authentication code
    const correctAuthCode = "12345";

    const handleChange = (name, value) => {
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            // Include validation for the authCode if the role is Admin
            if (userDetails.role === 'Admin') {
                if (userDetails.authCode !== correctAuthCode) {
                    notification.error({
                        message: 'Error',
                        description: 'Incorrect authentication code.'
                    });
                    return;
                }
            }

            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails)
            });

            const responseData = await response.json();

            if (responseData.message === 'Registration successful') {
                notification.success({
                    message: 'Success',
                    description: 'Registration successful!'
                });
                navigate('/'); // Redirect to login page after successful registration
            } else {
                notification.error({
                    message: 'Registration Failed',
                    description: responseData.message
                });
            }
        } catch (error) {
            console.error('There was an error during registration:', error);
            notification.error({
                message: 'Error',
                description: 'There was an error during registration.'
            });
        }
    };

    const goToLogin = () => {
        navigate('/');
    };

    return (
        <div className="registration-page" style={{ padding: 24 }}>
            <Button type="link" onClick={goToLogin} style={{ float: 'right' }}>
                Go to Login
            </Button>
            <h2>Register</h2>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input onChange={e => handleChange('name', e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
                >
                    <Input onChange={e => handleChange('email', e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password onChange={e => handleChange('password', e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please select your role!' }]}
                >
                    <Select defaultValue="Student" onChange={value => handleChange('role', value)}>
                        <Option value="Student">Student</Option>
                        <Option value="Admin">Admin</Option>
                    </Select>
                </Form.Item>
                {userDetails.role === 'Admin' && (
                    <Form.Item
                        label="Authentication Code"
                        name="authCode"
                        rules={[{ required: true, message: 'Please input the authentication code!' }]}
                    >
                        <Input onChange={e => handleChange('authCode', e.target.value)} />
                    </Form.Item>
                )}
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default RegistrationPage;
