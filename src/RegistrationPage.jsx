import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';


function RegistrationPage() {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student', // Default role, adjust based on your needs
      });
      
      //const [selectedFile, setSelectedFile] = useState(null); // To store the selected file
      //const [fileName, setFileName] = useState(''); // To store the name of the selected file for display
      const navigate = useNavigate(); // Initialize navigate for redirection after form submission

      // Update the handleChange to also handle file inputs
      const handleChange = (e) => {
        const { name, value} = e.target;
          setUserDetails({
            ...userDetails,
            [name]: value
          });
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // No need to use FormData for JSON request
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails) // Directly use userDetails here
            });
    
            const responseData = await response.json();
    
            if (responseData.message === 'Registration successful') {
                alert('Registration successful!');
                navigate('/'); // Redirect to login page after successful registration
            } else {
                alert('Registration failed: ' + responseData.message);
            }
        } catch (error) {
            console.error('There was an error during registration:', error);
        }
    };
    
      
    const goToLogin = () => {
        navigate('/');
    };

    return (
        <div className="registration-page">
            <div className="top-bar">
                <button onClick={goToLogin} style={{float: 'right', marginRight: '10px', marginTop: '10px'}}>Go to Login</button>
            </div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={userDetails.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={userDetails.email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={userDetails.password} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" value={userDetails.role} onChange={handleChange}>
                        <option value="Student">Student</option>
                        <option value="Admin">Admin</option>
                     
                    </select>
                </div>
                
                <button type="submit">Register</button>
            </form>
        </div>
    );
}/*{userDetails.role === 'Student' && (
                    <div>
                        <label htmlFor="photoID">Photo ID:</label>
                        <input type="file" id="photoID" name="photoID" onChange={handleChange} required />
                        {fileName && <span>{fileName}</span>}
                    </div>
                )}*/

export default RegistrationPage;
