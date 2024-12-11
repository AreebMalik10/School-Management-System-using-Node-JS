import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import TeacherFetchStudent from './teacherFetchStudent';


export default function Teacher() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, username } = location.state || {};

    const [leaveRequests, setLeaveRequests] = useState([]);  // State to store leave requests
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if token is available in localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            // If no token, redirect to login page
            navigate('/');
        }
        else {
            fetchLeaveRequests(username); // Fetch leave requests on mount
        }
    }, [navigate, username]);

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/');
    };

    const [teacherUsername, setTeacherUsername] = useState('');
    const [reason, setReason] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!teacherUsername || !reason || !startDate || !endDate) {
            setMessage('All fields are required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/teacher/createLeaveRequest', {
                teacherUsername,
                reason,
                startDate,
                endDate,
            });

            // Handle success response
            setMessage(response.data.message);
        } catch (error) {
            // Handle error response
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    const fetchLeaveRequests = async (teacherUsername) => {
        try {
            const token = localStorage.getItem('token');  // Get token for authorization
            const response = await axios.get('http://localhost:5000/teacher/viewLeaveRequests1', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: { username: teacherUsername }  // Send the teacher username as a query parameter
            });

            setLeaveRequests(response.data.leaveRequests);
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while fetching leave requests');
        }
    };


    return (
        <div className="flex flex-col items-left  bg-gray-100">
            <div className="text-center">
                <h1>Welcome to the Teacher Dashboard</h1>
                <h1 className="text-3xl font-bold mb-4">Welcome, {name}!</h1>
                <p className="text-xl">Username: {username}</p>

                <button
                    onClick={handleLogout}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create Leave Request</h2>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Teacher Username */}
                    <div className="mb-5">
                        <label htmlFor="teacherUsername" className="block text-gray-700 font-medium mb-2">
                            Your Username
                        </label>
                        <input
                            type="text"
                            id="teacherUsername"
                            value={teacherUsername}
                            onChange={(e) => setTeacherUsername(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
                            required
                        />
                    </div>

                    {/* Reason */}
                    <div className="mb-5">
                        <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
                            Reason for Leave
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
                            required
                        />
                    </div>

                    {/* Start Date */}
                    <div className="mb-5">
                        <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div className="mb-5">
                        <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
                    >
                        Submit Leave Request
                    </button>
                </form>

                {/* Message */}
                {message && <p className="text-center mt-4 text-red-600">{message}</p>}
            </div>


            {/* Display Leave Requests */}
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Your Leave Requests</h2>

                {/* Display error message if any */}
                {error && <p className="text-center text-red-600 font-medium">{error}</p>}

                {leaveRequests.length === 0 ? (
                    <p className="text-center text-gray-500">No leave requests found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-blue-100 text-gray-700">
                                    <th className="border-b p-3 text-left">ID</th>
                                    <th className="border-b p-3 text-left">Reason</th>
                                    <th className="border-b p-3 text-left">Start Date</th>
                                    <th className="border-b p-3 text-left">End Date</th>
                                    <th className="border-b p-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequests.map(request => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="border-b p-3">{request.id}</td>
                                        <td className="border-b p-3">{request.reason}</td>
                                        <td className="border-b p-3">{request.startDate}</td>
                                        <td className="border-b p-3">{request.endDate}</td>
                                        <td className="border-b p-3">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm ${request.status === "Approved"
                                                        ? "bg-green-200 text-green-800"
                                                        : request.status === "Pending"
                                                            ? "bg-yellow-200 text-yellow-800"
                                                            : "bg-red-200 text-red-800"
                                                    }`}
                                            >
                                                {request.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            <TeacherFetchStudent />

        </div>

    )
}
