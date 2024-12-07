import React, { useState } from 'react';
import axios from 'axios';

const AdminCreateClass = () => {
    const [className, setClassName] = useState('');
    const [section, setSection] = useState('');
    const [message, setMessage] = useState(''); // For success or error messages
    const [loading, setLoading] = useState(false); // For loading state

    // Admin data from local storage (session)
    const adminEmail = localStorage.getItem('adminEmail');
    const adminId = localStorage.getItem('adminId');

    const handleCreateClass = async () => {
        if (!className || !section) {
            setMessage("Please fill in all fields.");
            return;
        }

        const payload = {
            class_name: className,
            section: section,
            admin_email: adminEmail,
            admin_id: adminId
        };

        setLoading(true); // Start loading
        try {
            const response = await axios.post('http://localhost:5000/admin1/createclass', payload);
            setMessage(response.data.message); // Show success message
            console.log("Created class with ID: ", response.data.class_id);
            setClassName(''); // Reset fields
            setSection('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message); // Show backend error
            } else {
                setMessage("There was an error creating the class. Please try again.");
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <h3>Create New Class</h3>
            {message && <p style={{ color: 'red' }}>{message}</p>} {/* Display message */}
            <form onSubmit={(e) => { e.preventDefault(); handleCreateClass(); }}>
                <input 
                    type="text" 
                    placeholder="Class Name" 
                    value={className}
                    onChange={(e) => setClassName(e.target.value)} 
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Section" 
                    value={section}
                    onChange={(e) => setSection(e.target.value)} 
                    required 
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Class"}
                </button>
            </form>
        </div>
    );
};

export default AdminCreateClass;
