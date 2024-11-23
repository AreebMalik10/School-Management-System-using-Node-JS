import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin-login');  // Redirect to login if no token
        }

        const fetchAdmins = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admins', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAdmins(response.data);
            } catch (error) {
                setMessage('Error fetching admins');
            }
        };

        fetchAdmins();
    }, [navigate]);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/admins/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAdmins(admins.filter(admin => admin.id !== id));  // Remove deleted admin from the list
        } catch (error) {
            setMessage('Error deleting admin');
        }
    };

    return (
        <div className="container">
            <h2>Admin Dashboard</h2>
            {message && <p>{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td>{admin.name}</td>
                            <td>{admin.email}</td>
                            <td>
                                <button onClick={() => handleDelete(admin.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
