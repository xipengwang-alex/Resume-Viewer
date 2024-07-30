import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function RootRedirect() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/validateToken`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userRole = response.data.user.role;
        if (userRole === 'student') {
          navigate('/landing');
        } else if (userRole === 'recruiter') {
          navigate('/resumes');
        } else {
          // unexpected role
          navigate('/login');
        }
      } catch (error) {
        console.error('Error validating token:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
}

export default RootRedirect;