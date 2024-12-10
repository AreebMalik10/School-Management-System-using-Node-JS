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
            <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-12">
                <h3 className="text-3xl font-semibold text-gray-800 mb-6">Challan Details</h3>

                {/* Message */}
                {message && <p className="text-xl text-green-600 mb-4">{message}</p>}

                {/* Challan Table */}
                {challans.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="py-3 px-4 text-sm font-medium text-gray-700 border-b">Fee Amount</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-700 border-b">Fine Amount</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-700 border-b">Challan Month</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-700 border-b">Other Expenses</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-700 border-b">Total Amount</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-700 border-b">Challan Description</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-700 border-b">Due Date</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-700 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {challans.map(challan => (
                                    <tr key={challan.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-600 border-b">{challan.fee_amount}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 border-b">{challan.fine_amount}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 border-b">{challan.challan_month}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 border-b">{challan.others_expense}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 border-b">{challan.total_amount}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 border-b">{challan.challan_description}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 border-b">{challan.due_date}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 border-b">{challan.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-xl text-red-500 mt-4">No challans found for this student.</p>
                )}
            </div>


        </>
    )
}


