import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
 
 export default function StudentViewHisChallan() {
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
     <>
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
            
     </>
   )
 }
 

