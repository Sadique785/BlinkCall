import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react'; // Added Loader2 import
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess }from '../redux/auth/authSlice';
import { toast } from 'react-hot-toast';
import Header from '../components/Home/Header';
import axiosInstance from '../services/axios';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setIsLoading(true); // Set loading to true when submission starts
    
    try {
      dispatch(loginStart());
      
      const response = await axiosInstance.post('/auth/login/', {
        email: data.email,
        password: data.password
      });
  
      const userData = {
        accessToken: response.data.data.access,
        username: response.data.data.username,
        userId: response.data.data.user_id
      };
  
      dispatch(loginSuccess(userData));
      
      // Success toast
      toast.success('Login successful!', {
        icon: '👋',
        style: {
          borderRadius: '10px',
          background: '#22c55e',
          color: '#fff',
        },
      });
  
      navigate('/', { replace: true });
    } catch (error) {
      console.log(error)
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        errorMessage = firstError;
      }
  
      // Error toast
      toast.error(errorMessage, {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false); // Set loading to false when done, regardless of outcome
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

            {location.state?.message && (
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-100 text-center">
                {location.state.message}
              </div>
            )}

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
                <div className="relative">
                  <input
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
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
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
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