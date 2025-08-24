import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './calorieGoal.css'; 

const CalorieGoal: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const targetCalories = location.state?.targetCalories || 0;

    return (
        <div className="container-wrapper">
            <div className="container-form">
                <p>
                    Na osnovu podataka koje ste uneli, preporučeni dnevni unos kalorija kako biste postigli željenu telesnu težinu iznosi:
                </p>
                <span className='calorie-number'>{targetCalories} kcal</span>
                <p>
                    Kliknite na dugme ispod kako biste započeli kreiranje plana ishrane i dodavanje Vaših recepata.
                </p>
                <div className="button-div">
                    <button
                        onClick={() => navigate('/plans')}
                    >
                        ZAPOČNI
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalorieGoal;
