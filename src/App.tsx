import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import CalorieGoal from './Components/CalorieGoal/CalorieGoal';
import IngredientsPage from './Components/Ingredients/IngredientsPage';
import PlansPage from './Components/Plans/PlansPage';
import RecipesPage from './Components/Recipe/RecipesPage';
import HomePage from './Components/HomePage/HomePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/calorie-goal" element={<CalorieGoal />} />
        <Route path="/ingredients" element={<IngredientsPage/>} />
        <Route path="/recepies" element={<RecipesPage/>} />
        <Route path="/plans" element={<PlansPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;