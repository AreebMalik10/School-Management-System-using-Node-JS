import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuperAdmin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [admins, setAdmins] = useState([]);
    const [message, setMessage] = useState('');
    const [fetchError, setFetchError] = useState('');
    const [editingAdmin, setEditingAdmin] = useState(null);

    // Fetch all admins when the component mounts
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/view-admins', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setAdmins(response.data.admins);
            } catch (error) {
                setFetchError('Error fetching admins.');
            }
        };

        fetchAdmins();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // If we're editing an existing admin, update them
            if (editingAdmin) {
                const response = await axios.put(`http://localhost:5000/admin/update-admin/${editingAdmin.id}`, {
                    name,
                    email,
                    password,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setMessage(response.data.message);
            } else {
                // Otherwise, create a new admin
                const response = await axios.post('http://localhost:5000/admin/create-admin', {
                    name,
                    email,
                    password,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setMessage(response.data.message);
            }

            // Reset form after submission
            setName('');
            setEmail('');
            setPassword('');
            setEditingAdmin(null);

            // Re-fetch admins after creating or updating
            const fetchResponse = await axios.get('http://localhost:5000/admin/view-admins', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAdmins(fetchResponse.data.admins);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error creating or updating admin.');
        }
    };

    // Handle edit action
    const handleEdit = (admin) => {
        setEditingAdmin(admin);
        setName(admin.name);
        setEmail(admin.email);
        setPassword(''); // You can leave password empty for now, since it's optional during editing
    };

    // Handle delete action
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/admin/delete-admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMessage(response.data.message);

            // Re-fetch admins after deletion
            const fetchResponse = await axios.get('http://localhost:5000/admin/view-admins', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAdmins(fetchResponse.data.admins);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error deleting admin.');
        }
    };

    return (
        <div className="container">
            <h2>{editingAdmin ? 'Edit Admin' : 'Create Admin'}</h2>
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
                    required={!editingAdmin} // Only require password if editing a new admin
                />
                <button type="submit">{editingAdmin ? 'Update Admin' : 'Create Admin'}</button>
            </form>

            {message && <p>{message}</p>}
            {fetchError && <p>{fetchError}</p>}

            <h3>Admins List</h3>
            <ul>
                {admins.length > 0 ? (
                    admins.map((admin) => (
                        <li key={admin.id}>
                            {admin.name} ({admin.email})
                            <button onClick={() => handleEdit(admin)}>Edit</button>
                            <button onClick={() => handleDelete(admin.id)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <p>No admins found.</p>
                )}
            </ul>
        </div>
    );
};

export default SuperAdmin;
