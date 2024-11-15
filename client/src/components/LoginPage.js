/* client/src/components/LoginPage.js */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_BASE_URL, getCurrentOrganization } from '../config';

function LoginPage() {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const organization = getCurrentOrganization();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegistrationRedirect = () => {
    navigate(`/${organization}/register`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/${organization}/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      console.log('Token stored:', localStorage.getItem('token'));
      console.log('LoginPage response:', response.data.message);

      navigate(`/${organization}`, { replace: true });
      window.location.reload();
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {loading ? (
        <div>Logging in...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" disabled={loading}>Login</button>
          <button 
            type="button" 
            onClick={handleRegistrationRedirect} 
            disabled={loading}
          >
            Register New Student
          </button>
        </form>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default LoginPage;