import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/auth/login', {
                email,
                password,
            });

            // Storing the token and admin details in local storage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('adminName', response.data.name); // Saving admin's name
            localStorage.setItem('adminEmail', response.data.email); // Saving admin's email
            localStorage.setItem('adminId', response.data.adminId); // Save the admin ID after successful login


            setMessage('Login successful!');
            navigate('/admindashboard'); // Redirect to dashboard after login
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error logging in.');
        }
    };

    return (
        <div className="container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminLogin;
