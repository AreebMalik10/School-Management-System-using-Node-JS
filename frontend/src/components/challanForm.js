import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateChallan = () => {
    const [username, setUsername] = useState('');
    const [feeAmount, setFeeAmount] = useState('');
    const [fineAmount, setFineAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [challanMonth, setChallanMonth] = useState('');
    const [challanDescription, setChallanDescription] = useState('');
    const [othersExpense, setOthersExpense] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fetch admin's details from localStorage
    useEffect(() => {
        const email = localStorage.getItem('adminEmail');

        if (email) {
            setAdminEmail(email);
        } else {
            navigate('/adminlogin'); // Redirect if admin email not found
        }
    }, [navigate]);

    const handleSubmit = () => {
        // Construct the data object with dynamic values
        const data = {
            username,
            feeAmount,
            fineAmount,
            dueDate,
            challanMonth,
            challanDescription,
            othersExpense,
            adminEmail // Admin's email from localStorage
        };

        // Send data to backend
        axios.post('http://localhost:5000/admin1/createChallan', data)
            .then(response => {
                setMessage('Challan Created Successfully');
            })
            .catch(error => {
                console.error(error);
                setMessage('Error in creating challan');
            });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Challan</h2>

            {/* Message Display */}
            {message && (
                <p className="text-green-600 bg-green-100 border border-green-200 p-3 rounded mb-4">
                    {message}
                </p>
            )}

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                {/* Student Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Student Username
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter student username"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Fee Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fee Amount
                    </label>
                    <input
                        type="number"
                        value={feeAmount}
                        onChange={(e) => setFeeAmount(e.target.value)}
                        placeholder="Enter fee amount"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Fine Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fine Amount
                    </label>
                    <input
                        type="number"
                        value={fineAmount}
                        onChange={(e) => setFineAmount(e.target.value)}
                        placeholder="Enter fine amount"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Due Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                    </label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Challan Month */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Challan Month
                    </label>
                    <input
                        type="text"
                        value={challanMonth}
                        onChange={(e) => setChallanMonth(e.target.value)}
                        placeholder="Enter challan month"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Challan Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Challan Description
                    </label>
                    <textarea
                        value={challanDescription}
                        onChange={(e) => setChallanDescription(e.target.value)}
                        placeholder="Add a description for the challan"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows="3"
                    />
                </div>

                {/* Other Expenses */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other Expenses
                    </label>
                    <input
                        type="number"
                        value={othersExpense}
                        onChange={(e) => setOthersExpense(e.target.value)}
                        placeholder="Enter other expenses"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Create Challan
                    </button>
                </div>
            </form>
        </div>

    );
};

export default CreateChallan;
