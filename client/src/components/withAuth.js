/* client/src/components/withAuth.js */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_BASE_URL, getCurrentOrganization } from '../config';

const withAuth = (WrappedComponent, allowedRoles) => {
  const AuthenticatedComponent = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const organization = getCurrentOrganization();

    const validateToken = useCallback(async (token) => {
      try {
        const res = await axios.get(`${AUTH_BASE_URL}/${organization}/validateToken`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!allowedRoles.includes(res.data.user.role) && res.data.user.role !== 'admin') {
          navigate(`/${organization}/login`);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        navigate(`/${organization}/login`);
      }
      setIsLoading(false);
    }, [navigate, organization]);


    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate(`/${organization}/login`);
        setIsLoading(false);
      } else {
        validateToken(token);
      }
    }, [navigate, validateToken, organization]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return AuthenticatedComponent;
};

export default withAuth;
