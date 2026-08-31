import React from 'react'
import Home from './pages/Home'
import { Routes, Route } from "react-router";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Resumebuilder from './pages/Resumebuilder';
import { useAuth } from './context/AuthContext';

const App = () => {

  const { user } = useAuth();
  console.log(user);


  return (
    <div>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/resumebuilder' element={<Resumebuilder />} />
        <Route
          path='/resumebuilder/:resumeId'
          element={<Resumebuilder />}
        />
      </Routes>

    </div>
  )
}

export default App
