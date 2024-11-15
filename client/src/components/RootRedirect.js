/* client/src/components/RootRedirect.js */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, AUTH_BASE_URL, getCurrentOrganization } from '../config';

function RootRedirect() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const organization = getCurrentOrganization();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate(`/${organization}/login`);
        return;
      }

      try {
        const response = await axios.get(`${AUTH_BASE_URL}/${organization}/validateToken`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userRole = response.data.user.role;
        if (userRole === 'student') {
          try {
            await axios.get(`${API_BASE_URL}/myprofile`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/${organization}/landing`, { replace: true });
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.log('Profile not found, navigating to setup');
              navigate(`/${organization}/setup`, { replace: true });
            } else {
              console.error('Error checking profile:', error);
              navigate(`/${organization}/login`, { replace: true });
            }
          }
        } else if (userRole === 'recruiter') {
          navigate(`/${organization}/resumes`, { replace: true });
        } else {
          navigate(`/${organization}/login`, { replace: true });
        }
      } catch (error) {
        console.error('Error validating token:', error);
        navigate(`/${organization}/login`, { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [navigate, organization]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
}

export default RootRedirect;