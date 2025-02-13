// Login.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import Header from '../components/Home/Header';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate()
  const onSubmit = (data) => {
    console.log(data);
    // Handle login logic here
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
          <div className="text-center mb-8"
          >
              <img 
                  src="/images/final1.png"
                  alt="BlinkCall"
                  className="h-16 w-auto object-contain mx-auto"
                  
              />
          </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-white">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-white hover:text-blue-400">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Sign In
              </button>

              <p
                className="text-center text-white text-sm cursor-pointer"
                onClick={() => navigate('/register')}
               
               >
                Don't have an account?{' '}
                <span className="text-blue-400 hover:text-blue-300">
                    Sign up
                </span>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;