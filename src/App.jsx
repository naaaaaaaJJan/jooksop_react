import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css'

function App() {
  const isLoggedIn = true;

  return(
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App
