import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import CalorieGoal from './Components/CalorieGoal/CalorieGoal';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/calorie-goal" element={<CalorieGoal />} />
        <Route path="/dashboard" element={<Dashboard />}  />
      </Routes>
    </BrowserRouter>
  );
};

export default App;