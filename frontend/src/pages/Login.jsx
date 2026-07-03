import React from 'react'

import { SignIn } from "@clerk/clerk-react";
const Login = () => {
  return (
    <div  className="min-h-screen flex items-center justify-center">
     <SignIn/>
    </div>
  )
}

export default Login