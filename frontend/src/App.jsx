import React from 'react'
import Home from './pages/Home'
import { Routes, Route } from "react-router";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useUser } from "@clerk/clerk-react";

const App = () => {

  const { user } = useUser();
  console.log(user);
  

  return (
    <div>
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
      
    </div>
  )
}

export default App