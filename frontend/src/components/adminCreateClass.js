import React, { useState } from 'react';
import axios from 'axios';

const AdminCreateClass = () => {
    const [className, setClassName] = useState('');
    const [section, setSection] = useState('');
    const [teacherUsername, setTeacherUsername] = useState(''); // Teacher username state
    const [message, setMessage] = useState(''); // For success or error messages
    const [loading, setLoading] = useState(false); // For loading state

    // Admin data from local storage (session)
    const adminEmail = localStorage.getItem('adminEmail');
    const adminId = localStorage.getItem('adminId');

    const handleCreateClass = async () => {
        if (!className || !section || !teacherUsername) { // Add teacher check
            setMessage("Please fill in all fields.");
            return;
        }

        const payload = {
            class_name: className,
            section: section,
            admin_email: adminEmail,
            admin_id: adminId,
            teacher_username: teacherUsername // Send teacher username
        };

        setLoading(true); // Start loading
        try {
            const response = await axios.post('http://localhost:5000/admin1/createclass', payload);
            setMessage(response.data.message); // Show success message
            console.log("Created class with ID: ", response.data.class_id);
            setClassName(''); // Reset fields
            setSection('');
            setTeacherUsername(''); // Reset teacher username
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
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
        {/* Heading */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Class</h3>
    
        {/* Message */}
        {message && <p className="text-red-500 text-sm mb-4">{message}</p>} 
    
        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleCreateClass(); }} className="space-y-4">
            {/* Class Name */}
            <div>
                <input
                    type="text"
                    placeholder="Class Name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
            </div>
    
            {/* Section */}
            <div>
                <input
                    type="number"
                    placeholder="Section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
            </div>
    
            {/* Teacher Username */}
            <div>
                <input
                    type="text"
                    placeholder="Teacher Username"
                    value={teacherUsername}
                    onChange={(e) => setTeacherUsername(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
            </div>
    
            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                {loading ? "Creating..." : "Create Class"}
            </button>
        </form>
    </div>
    
    );
};

export default AdminCreateClass;
