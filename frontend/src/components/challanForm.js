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
        <div>
            <h2>Create Challan</h2>
            {message && <p>{message}</p>} {/* Display the message */}
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div>
                    <label>Student Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Fee Amount:</label>
                    <input
                        type="number"
                        value={feeAmount}
                        onChange={(e) => setFeeAmount(e.target.value)}
                    />
                </div>
                <div>
                    <label>Fine Amount:</label>
                    <input
                        type="number"
                        value={fineAmount}
                        onChange={(e) => setFineAmount(e.target.value)}
                    />
                </div>
                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <div>
                    <label>Challan Month:</label>
                    <input
                        type="text"
                        value={challanMonth}
                        onChange={(e) => setChallanMonth(e.target.value)}
                    />
                </div>
                <div>
                    <label>Challan Description:</label>
                    <textarea
                        value={challanDescription}
                        onChange={(e) => setChallanDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Other Expenses:</label>
                    <input
                        type="number"
                        value={othersExpense}
                        onChange={(e) => setOthersExpense(e.target.value)}
                    />
                </div>
                <button type="submit">Create Challan</button>
            </form>
        </div>
    );
};

export default CreateChallan;
