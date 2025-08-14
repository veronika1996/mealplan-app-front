import React, { useState } from 'react';
import axios from 'axios'; // Importing axios
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Styles

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if username and password are provided
    if (!username || !password) {
      setError('Username and password are required!');
      return;
    }

    const userLoginDTO = {
      username: username,
      password: password,
    };

    try {
      // Sending POST request with user credentials
      const response = await axios.post('http://localhost:8082/meal_plan/users/login', userLoginDTO);

      console.log(response);
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log(localStorage.getItem('user'));
      // If the response is successful, redirect the user to the dashboard
      console.log('Login successful:', response.data);
      navigate('/plans'); // or any other URL you want to redirect the user to
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            // Error handling when sending POST request
            if (error.response) {
                // Backend error - take message from the response
                console.log(error.response)
                setError(error.response.data || 'Registration failed');
            }
        } else {
            // Connection error
            console.log(error)
            setError('An error occurred. Please try again.');
        }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
