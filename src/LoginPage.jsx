import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [credentials, setCredentials] = useState({
        name: '',
        username: '',
        password: '',
        role: 'Student', // Default role
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

            if (responseData.message === 'Login successful') {
               
                // Assuming the backend sends back the user's role,
                // you can redirect based on the role here
                if (credentials.role === 'Student') {
                   // alert('Login successful by student!');
                    navigate('/dashboard/student');
                } 
                else{
                    navigate('/dashboard/admin');
                }
            } else {
                // Handle login failure (e.g., show error message)
                console.error('Login failed:', responseData.message);
            }
        } catch (error) {
            console.error('There was an error logging in:', error);
        }
    };

    const navigateToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={credentials.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email} // Update the state property name accordingly
                    onChange={handleChange}
                    required
                />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={credentials.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="Student">Student</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Login</button>
            </form>
            <div className="no-account">
                
                <button onClick={navigateToRegister} className="register-btn">Don't have an account? 
                Register Now</button>
            </div>
        </div>
    );
}

export default LoginPage;
