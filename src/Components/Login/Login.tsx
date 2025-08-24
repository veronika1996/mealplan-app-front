import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Korisničko ime i lozinka su obavezni!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8082/meal_plan/users/login', {
        username,
        password,
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/plans');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data || 'Prijava neuspešna');
      } else {
        setError('Došlo je do greške. Pokušajte ponovo.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Prijavite se</h2>
        {error && <p className="error-message-login" style={{color: 'red'}}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Korisničko ime:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
  <label>Lozinka:</label>
  <input
    type={showPassword ? 'text' : 'password'}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{
      width: '100%',
      height: '57px',
      paddingRight: '2.5rem',
      boxSizing: 'border-box', 
      fontSize: '25px',
    }}
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: 'absolute',
      right: '0.5rem',
      top: '53%',
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




          <div className="button-div">
            <button type="submit" style={{fontSize: '25px', marginTop: '50px'}}>Prijavi se</button>
          </div>
        </form>

        <p className="register-link">
          Nemate nalog? <a href="/register">Registrujte se ovde</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
