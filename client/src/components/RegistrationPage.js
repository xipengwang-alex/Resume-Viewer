/* client/src/components/RegistrationPage.js */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_BASE_URL, getCurrentOrganization } from '../config';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const organization = getCurrentOrganization();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      //const response = await axios.post(`${API_BASE_URL}/register`, { username, password, role });
      const response = await axios.post(`${AUTH_BASE_URL}/${organization}/register`, { username, password });
      console.log(response.data.message);
      localStorage.setItem('token', response.data.token);

      navigate(`/${organization}`, { replace: true });
      window.location.reload();
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate(`/${organization}/login`);
  };

  return (
    <div>
      <h2>Register New Student</h2>
      {loading ? (
        <div>Registering...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>Register</button>
          <button type="button" onClick={handleLoginRedirect}>Return to Login</button>
        </form>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default RegistrationPage;