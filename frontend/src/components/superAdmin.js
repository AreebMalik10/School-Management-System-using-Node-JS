import React, { useState } from 'react';
import axios from 'axios';

const SuperAdmin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Get the token (assuming it's stored in localStorage)
        const token = localStorage.getItem('jwtToken');  // Or use any method where the token is stored
    
        try {
            const response = await axios.post(
                'http://localhost:5000/superadmin/create-admin', 
                { name, email, password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`  // Add token to headers
                    }
                }
            );
            setMessage('Admin account created successfully!');
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            setMessage('Error creating admin account');
        }
    };
    
    return (
        <div className="container">
            <h2>Create Admin Account</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <button type="submit">Create Admin</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SuperAdmin;
