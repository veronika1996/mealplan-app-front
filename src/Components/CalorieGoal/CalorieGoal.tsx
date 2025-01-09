import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './calorieGoal.css'; 

const CalorieGoal: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const targetCalories = location.state?.targetCalories || 0;

    return (
        <div className="calorie-container">
            <div className="calorie-form">
                <h1>Calorie Goal</h1>
                <p>
                    Based on the information you provided, the number of calories you need to consume to reach your target weight is:
                </p>
                <span className='calorie-number'> {targetCalories} </span>
                <p>
                    Click the button below to BEGIN creating your meal plans and adding desired recipes.
                </p>
                <button
                    className="begin-button"
                    onClick={() => navigate('/dashboard')}
                >
                    BEGIN
                </button>
            </div>
        </div>
    );
};

export default CalorieGoal;
