import React, { useState } from 'react';

export default function AdminDashboard() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', extra: '' });
    const [role, setRole] = useState('student'); // Default role

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = `/admin/create-${role}`; // Dynamic URL based on role
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <select onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
            </select>

            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleInputChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleInputChange} required />
                {role === 'student' && <input type="text" name="extra" placeholder="Roll Number and Class" onChange={handleInputChange} />}
                {role === 'teacher' && <input type="text" name="extra" placeholder="Subject and Contact Number" onChange={handleInputChange} />}
                {role === 'parent' && <input type="text" name="extra" placeholder="Child Name and Relationship" onChange={handleInputChange} />}
                <button type="submit">Create {role} Account</button>
            </form>
        </div>
    );
}
