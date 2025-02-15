import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../components/Home/Header';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axios';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setApiError(null);
      
      // Send registration data to the backend
      await axiosInstance.post('/auth/register/', {
        username: data.username,
        email: data.email,
        password: data.password
      });
      
      // Redirect to login after successful registration
      navigate('/login', { 
        state: { message: 'Registration successful! Please login with your credentials.' }
      });
      
    } catch (error) {
      console.log(error)
      // Handle registration errors
      if (error.response?.data?.detail) {
        setApiError(error.response.data.detail);
      } else if (error.response?.data) {
        // Handle validation errors from serializer
        const errorMessage = Object.values(error.response.data)[0];
        setApiError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
      } else {
        setApiError('Registration failed. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full">
        <div 
          className="flex flex-col items-center justify-center min-h-screen w-full relative bg-cover bg-center bg-no-repeat -mt-16"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)),
              url('/images/background.jpg')
            `
          }}
        >
          <div className="w-full max-w-md p-8 rounded-lg backdrop-blur-md bg-white/20 shadow-xl border border-white/30">
            <div className="text-center mb-8">
              <img 
                src="/images/final1.png"
                alt="BlinkCall"
                className="h-16 w-auto object-contain mx-auto"
              />
            </div>

            {apiError && (
              <div className="mb-4 p-3 bg-red-500/30 border border-red-500 rounded-lg text-white text-sm">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  {...register("username", { 
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters"
                    }
                  })}
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md"
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  type="password"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md"
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 ${
                  isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded-lg font-medium transition-colors duration-200 flex justify-center items-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>

              <p 
                className="text-center text-white text-sm cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Already have an account?{' '}
                <span className="text-blue-400 hover:text-blue-300">
                  Login
                </span>
              </p>    
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;