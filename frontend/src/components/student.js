import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

export default function Student() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { name, username } = location.state || {};

    useEffect(() => {
        // Check if token is available in localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
            // If no token, redirect to login page
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1>Welcome to the Student Dashboard</h1>
                <h1 className="text-3xl font-bold mb-4">Welcome, {name}!</h1>
                <p className="text-xl">Username: {username}</p>
                <button 
                    onClick={handleLogout} 
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
