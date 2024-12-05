import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

export default function Student() {
    const location = useLocation();
    const navigate = useNavigate();
    const [challans, setChallans] = useState([]);
    const [message, setMessage] = useState('');
    
    const { name, username } = useLocation().state || {}; // Get the name and username from location state

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

    useEffect(() => {
        if (username) {
            axios.get(`http://localhost:5000/student/getChallanByUsername?username=${username}`)
                .then(response => {
                    setChallans(response.data); // Store the challans in state
                })
                .catch(error => {
                    console.error(error);
                    setMessage('Error fetching challan data');
                });
        }
    }, [username]);  // Dependency on username to re-fetch when it changes


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
            <div>
            <h3>Challan Details</h3>
            {message && <p>{message}</p>}
            {challans.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Fee Amount</th>
                            <th>Fine Amount</th>
                            <th>Challan Month</th>
                            <th>Other Expenses</th>
                            <th>Total Amount</th>
                            <th>Challan Description</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {challans.map(challan => (
                            <tr key={challan.id}>
                                <td>{challan.fee_amount}</td>
                                <td>{challan.fine_amount}</td>
                                <td>{challan.challan_month}</td>
                                <td>{challan.others_expense}</td>
                                <td>{challan.total_amount}</td>
                                <td>{challan.challan_description}</td>
                                <td>{challan.due_date}</td>
                                <td>{challan.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No challans found for this student.</p>
            )}
            </div>
        </div>
    );
}
