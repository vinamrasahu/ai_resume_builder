import React, { useState } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';

// TEMPORARY: Remove this helper and its call in handleGoogleSignIn after testing tokens.
const getToken = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.log('User login nahi hai');
    return;
  }

  const token = await user.getIdToken();
  console.log('Firebase ID Token:', token);
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      // TEMPORARY: Remove this line after you finish checking Firebase ID tokens.
      await getToken();
      navigate('/dashboard');
    } catch (signInError) {
      setError(signInError.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div  className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-slate-600">Sign in to continue building your resume.</p>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="mt-6 w-full rounded-md bg-[#05a2ff] px-4 py-3 font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </button>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}

export default Login
