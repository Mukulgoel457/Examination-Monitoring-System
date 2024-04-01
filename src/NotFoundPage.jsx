import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  // Function to navigate back to the homepage or any other page
  const goToHome = () => {
    navigate('/'); // Adjust the path as necessary, for example, '/login' or '/dashboard/student'
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <button onClick={goToHome} style={{ marginTop: '20px' }}>Go to Login Page</button>
    </div>
  );
}

export default NotFoundPage;
