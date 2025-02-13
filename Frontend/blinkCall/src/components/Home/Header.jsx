import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false);
    const handleLogoClick = () => {
        console.log('its called guys')
        navigate("/");
      }
    
    // Pages where header should be transparent
    const transparentPages = ['/', '/register', '/login'];
    const isTransparentPage = transparentPages.includes(location.pathname);

    const handleLogin = () => {
        navigate('/login')
    }

    const handleRegister = () => {
        navigate('/register')
    }

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = `
        w-full fixed top-0 left-0 z-50 transition-all duration-300
        ${isTransparentPage && !scrolled ? 'bg-transparent' : 'bg-gray-900/95 backdrop-blur-sm shadow-md'}
    `.trim();

    const textClasses = `
        transition-colors duration-300
        ${isTransparentPage && !scrolled ? 'text-white' : 'text-gray-100'}
    `.trim();

    const buttonHoverClass = isTransparentPage && !scrolled 
        ? 'hover:text-gray-300' 
        : 'hover:text-white';

    return (
        <>
            <header className={headerClasses}>
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                    <div className={`text-xl font-bold ${textClasses}`}>
                        <img 
                            src="/images/final1.png"
                            alt="BlinkCall"
                            className="h-16 w-auto object-contain hover:cursor-pointer"
                            onClick={handleLogoClick}
                        />
                    </div>
                        <div className="space-x-4">
                            <button className={`px-4 py-2 ${textClasses} ${buttonHoverClass}`}
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                onClick={handleRegister}
                            
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
            {/* Spacer div to prevent content from going under header */}
            <div className="h-16"></div>
        </>
    );
};

export default Header;