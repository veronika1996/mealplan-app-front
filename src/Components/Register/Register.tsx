import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [height, setHeight] = useState<string>('');
    const [currentWeight, setCurrentWeight] = useState<string>(''); 
    const [targetWeight, setTargetWeight] = useState<string>(''); 
    const [yearsOld, setYearsOld] = useState<string>(''); 
    const [gender, setGender] = useState<string>('');
    const [activityLevel, setActivityLevel] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password || !confirmPassword || !height || !currentWeight || !targetWeight || !yearsOld || !gender || !activityLevel) {
            console.log(username);
            console.log(password);
            console.log(confirmPassword);
            console.log(currentWeight);
            console.log(height);
            console.log(targetWeight);
            console.log(yearsOld);
            console.log(gender);
            console.log(activityLevel);
            setError('Sva polja su obavezna!');
            return;
        }

        if (password !== confirmPassword) {
            setError('Lozinka i potvrda lozinke se ne poklapaju!');
            return;
        }

        if (Number(height) <= 0 || Number(currentWeight) <= 0 || Number(targetWeight) <= 0 || Number(yearsOld) <= 0) {
            setError('Visina, težina, ciljana težina i godine moraju biti pozitivni brojevi!');
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

            console.log('Registracija uspešna:', response.data);

            localStorage.setItem('user', JSON.stringify(response.data));

            const targetCalories = response.data.targetCalories;

            navigate('/calorie-goal', { state: { targetCalories } });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setError(error.response.data || 'Registracija neuspešna');
                }
            } else {
                setError('Došlo je do greške. Pokušajte ponovo.');
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h1>Registracija</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleRegister}>
                    {/* Username */}
                    <div className="form-group">
                        <label>Korisničko ime:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Lozinka:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: '2.5rem', height: '2.5rem', boxSizing: 'border-box', width: '100%' }}
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '0.5rem',
                                top: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 50,
                                color: '#4caf50',
                                height: '1.5rem',
                                width: '1.5rem',
                            }}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </span>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Potvrdi lozinku:</label>
                        <input
    type={showPassword ? 'text' : 'password'}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
  />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '0.5rem',
                                top: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 50,
                                color: '#4caf50',
                                height: '1.5rem',
                                width: '1.5rem',
                            }}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </span>
                    </div>


                    {/* Visina / Godine */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Visina (cm):</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Godine:</label>
                            <input
                                type="number"
                                value={yearsOld}
                                onChange={(e) => setYearsOld(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Trenutna Težina / Ciljna Težina */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Trenutna težina (kg):</label>
                            <input
                                type="number"
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Ciljna težina (kg):</label>
                            <input
                                type="number"
                                value={targetWeight}
                                onChange={(e) => setTargetWeight(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Nivo aktivnosti */}
                    <div className="form-group">
                        <label>Nivo aktivnosti:</label>
                        <select
                            value={activityLevel}
                            onChange={(e) => setActivityLevel(e.target.value)}
                            required
                        >
                            <option value="" disabled>Izaberite nivo aktivnosti</option>
                            <option value="SEDENTARY">Minimalna aktivnost (sedelački način života)</option>
                            <option value="LIGHT_ACTIVITY">Laka aktivnost (trening 1-3 dana nedeljno)</option>
                            <option value="MODERATE_ACTIVITY">Umerena aktivnost (trening 3-5 dana nedeljno)</option>
                            <option value="HIGH_ACTIVITY">Visoka aktivnost (trening 6-7 dana nedeljno)</option>
                            <option value="VERY_HIGH_ACTIVITY">Veoma visoka aktivnost (fizički posao ili intenzivni treninzi)</option>
                        </select>
                    </div>

                    {/* Pol */}
                    <div className="form-group">
                        <label>Pol:</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="" disabled>Izaberite pol</option>
                            <option value="MALE">Muški</option>
                            <option value="FEMALE">Ženski</option>
                        </select>
                    </div>

                    <button type="submit" className="register-button">Registruj se</button>
                </form>
                <p className="login-link">
                    Već imate nalog? <a href="/login">Prijavite se ovde</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
