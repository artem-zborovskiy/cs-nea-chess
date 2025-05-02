import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router"; // Import of the dependency, which is necessary for the navigation
import Home from './pages/Home';
import Play from './pages/Play';
import Puzzles from './pages/Puzzles';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import GameComputer from './pages/GameComputer';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter> {/* As it is JSX, not ordinary JavaScript, comments here are written in different syntax */}
    <Routes>
      <Route path="/home" element={<Home/>}/>
      <Route path="/play" element={<Play/>}/>
      <Route path="/puzzles" element={<Puzzles/>}/>
      <Route path="/auth" element={<Auth/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/game/computer" element={<GameComputer/>}/>
      {/* Catch-all for unknown routes */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  </BrowserRouter>
);