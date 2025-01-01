import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css'; // Styles

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [height, setHeight] = useState<number>(0);
    const [currentWeight, setCurrentWeight] = useState<number>(0);
    const [targetWeight, setTargetWeight] = useState<number>(0);
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form validation
        if (!username || !password || !height || !currentWeight || !targetWeight) {
            setError('All fields are required!');
            return;
        }

        if (height <= 0 || currentWeight <= 0 || targetWeight <= 0) {
            setError('Height, weight and target weight must be positive!');
            return;
        }

        // Data to be sent to the backend
        const userData = {
            username,
            password,
            height: parseInt(height.toString(), 10),
            currentWeight: parseInt(currentWeight.toString(), 10),
            targetWeight: parseInt(targetWeight.toString(), 10),
        };

        try {
            // Sending POST request with data to the backend
            const response = await axios.post('http://localhost:8082/meal_plan/users/register', userData);

            // If registration is successful, redirect user to the dashboard
            console.log('Registration successful:', response.data);
            navigate('/dashboard');
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
        <div className="register-container">
            <div className="register-form">
                <h1>Register</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleRegister}>
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
                    <div className="form-group">
                        <label>Height (cm):</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(parseInt(e.target.value))}
                        />
                    </div>
                    <div className="form-group">
                        <label>Current Weight (kg):</label>
                        <input
                            type="number"
                            value={currentWeight}
                            onChange={(e) => setCurrentWeight(parseInt(e.target.value))}
                        />
                    </div>
                    <div className="form-group">
                        <label>Target Weight (kg):</label>
                        <input
                            type="number"
                            value={targetWeight}
                            onChange={(e) => setTargetWeight(parseInt(e.target.value))}
                        />
                    </div>
                    <button type="submit" className="register-button">Register</button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
