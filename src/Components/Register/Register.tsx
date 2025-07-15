import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css'; 

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [height, setHeight] = useState<string>('');
    const [currentWeight, setCurrentWeight] = useState<string>(''); 
    const [targetWeight, setTargetWeight] = useState<string>(''); 
    const [yearsOld, setYearsOld] = useState<string>(''); 
    const [gender, setGender] = useState<string>('');
    const [activityLevel, setActivityLevel] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password || !height || !currentWeight || !targetWeight || !yearsOld || !gender || !activityLevel) {
            setError('All fields are required!');
            return;
        }

        if (Number(height) <= 0 || Number(currentWeight) <= 0 || Number(targetWeight) <= 0 || Number(yearsOld) <= 0) {
            setError('Height, weight, target weight, and years must be positive numbers!');
            return;
        }

        const userData = {
            username,
            password,
            height: parseInt(height, 10),
            currentWeight: parseInt(currentWeight, 10),
            targetWeight: parseInt(targetWeight, 10),
            yearsOld: parseInt(yearsOld, 10),
            gender,
            activityLevel,
        };

        try {
            const response = await axios.post('http://localhost:8082/meal_plan/users/register', userData);

            console.log('Registration successful:', response.data);

            localStorage.setItem('user', JSON.stringify(response.data));
            console.log(localStorage.getItem('user'));

            //backend will return target calories
            const targetCalories = response.data.targetCalories;

            // redirect to new component
            navigate('/calorie-goal', { state: { targetCalories } });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setError(error.response.data || 'Registration failed');
                }
            } else {
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
                    <div className="form-row">
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group align-right">
                            <label>Password:</label>
                                <input
                                    type="password"
                                    value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                        <label>Height (cm):</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group align-right">
                            <label>Years:</label>
                            <input
                                type="number"
                                value={yearsOld}
                                onChange={(e) => setYearsOld(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Current Weight (kg):</label>
                            <input
                                type="number"
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group align-right">
                            <label>Target Weight (kg):</label>
                                <input
                                    type="number"
                                    value={targetWeight}
                                    onChange={(e) => setTargetWeight(e.target.value)}
                                    required
                                />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                        <label>Activity Level:</label>
                            <select
                                value={activityLevel}
                                onChange={(e) => setActivityLevel(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select your activity level</option>
                                <option value="SEDENTARY">Minimal activity (sedentary lifestyle)</option>
                                <option value="LIGHT_ACTIVITY">Light activity (exercise 1-3 days per week)</option>
                                <option value="MODERATE_ACTIVITY">Moderate activity (exercise 3-5 days per week)</option>
                                <option value="HIGH_ACTIVITY">High activity (exercise 6-7 days per week)</option>
                                <option value="VERY_HIGH_ACTIVITY">Very high activity (physical job or intense training)</option>
                            </select>
                        </div>
                        <div className="form-group align-right">
                            <label>Gender:</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select your gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>
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
