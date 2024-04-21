// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function LoginPage() {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();

  await axios.post(`${API_BASE_URL}/login`, { username, password })
    .then(response => {
      localStorage.setItem('token', response.data.token); 
      console.log('Token stored:', localStorage.getItem('token'));
      console.log('LoginPage response:', response.data.message); 
      

      if (response.data.role === 'student') {
        navigate('/landing', { replace: true });
      } else if (response.data.role === 'recruiter') {
        navigate('/resumes', { replace: true });
      }
      window.location.reload();
    })
    .catch(error => {
      console.error('Login failed:', error);
      setError(error.response.data.message); 
    });

  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
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
        <button type="submit">Login</button>
        <button type="button" onClick={() => navigate('/register')}>Register</button>
      </form>
    </div>
  );
}

export default LoginPage;