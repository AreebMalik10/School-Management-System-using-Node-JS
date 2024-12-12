import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function StudentLeaveRequest() {
    const location = useLocation();
    const { username: studentUsername } = location.state || {}; // Get the username from location state
    const [reason, setReason] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [classTeacherUsername, setClassTeacherUsername] = useState('');
    const [class_name, setClass_name] = useState('');
    const [section, setSection] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data
        const data = {
            reason,
            startDate,
            endDate,
            classTeacherUsername,
            username: studentUsername,
            class_name,
            section,
        };

        try {
            // Send a POST request to the backend
            const response = await axios.post('http://localhost:5000/student/create-leave-request', data);

            // Handle success
            setSuccessMessage(response.data.message);
            setErrorMessage('');
        } catch (error) {
            // Handle error
            setErrorMessage(error.response ? error.response.data.message : "Something went wrong");
            setSuccessMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Create Leave Request</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">Student Username:</label>
                        <input 
                            type="text" 
                            value={studentUsername} 
                            readOnly 
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">Class Teacher Username:</label>
                        <input 
                            type="text" 
                            value={classTeacherUsername} 
                            onChange={(e) => setClassTeacherUsername(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">Class Name</label>
                        <input 
                            type="text" 
                            value={class_name} 
                            onChange={(e) => setClass_name(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">Section</label>
                        <input 
                            type="text" 
                            value={section} 
                            onChange={(e) => setSection(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    

                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">Reason:</label>
                        <input 
                            type="text" 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">Start Date:</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">End Date:</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button type="submit" className="w-full py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        Submit Leave Request
                    </button>
                </form>

                {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
                {successMessage && <p className="mt-4 text-green-500 text-center">{successMessage}</p>}
            </div>
        </div>
    );
}
