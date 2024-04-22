import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const withAuth = (WrappedComponent, allowedRoles) => {
  const AuthenticatedComponent = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const validateToken = useCallback( async (token) => {
      try {
        const res = await axios.get(`${API_BASE_URL}/validateToken`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!allowedRoles.includes(res.data.user.role) && res.data.user.role !== 'admin') {
          //navigate('/unauthorized');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        navigate('/login');
      }
      setIsLoading(false);
    }, [navigate]);
    


    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        setIsLoading(false);
      } else {
        validateToken(token);
      }
    }, [navigate, validateToken]);


    if (isLoading) {
      return <div>Loading...</div>; 
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return AuthenticatedComponent;
};

export default withAuth;
