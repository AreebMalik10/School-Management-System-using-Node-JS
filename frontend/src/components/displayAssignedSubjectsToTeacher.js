import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DisplayAssignedSubjectsToTeacher = () => {
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [error, setError] = useState(null);
    const [editingSubject, setEditingSubject] = useState(null); // State for tracking the subject being edited
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('adminEmail');
        if (email) {
            fetchSubjects(email);
        } else {
            navigate('/adminlogin'); // Redirect to login if no email found
        }
    }, [navigate]);
    
    const fetchSubjects = (adminEmail) => {
        fetch(`http://localhost:5000/admin1/get-assigned-subjects?admin_email=${adminEmail}`)
            .then(response => response.json())
            .then(data => {
                if (data.subjects) {
                    setAssignedSubjects(data.subjects); // Store subjects in state
                }
            })
            .catch(error => {
                console.error('Error fetching subjects:', error);
            });
    };

    const handleEdit = (subject) => {
        setEditingSubject(subject); // Set subject for editing
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedSubject = {
            subject_name: e.target.subject_name.value,
            class_name: e.target.class_name.value,
            section: e.target.section.value,
            teacher_username: e.target.teacher_username.value,
            admin_email: localStorage.getItem('adminEmail'), // The admin email remains unchanged
        };

        fetch(`http://localhost:5000/admin1/update-assigned-subject/${editingSubject.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSubject),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update local state with the new subject details
                const updatedSubjects = assignedSubjects.map(subject =>
                    subject.id === editingSubject.id ? { ...subject, ...updatedSubject } : subject
                );
                setAssignedSubjects(updatedSubjects);
                setEditingSubject(null); // Clear editing state
            }
        })
        .catch(error => {
            console.error('Error updating subject:', error);
        });
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:5000/admin1/delete-assigned-subject/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove the subject from the list
                setAssignedSubjects(assignedSubjects.filter(subject => subject.id !== id));
            }
        })
        .catch(error => {
            console.error('Error deleting subject:', error);
        });
    };

    return (
<div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 mt-8">
    {/* Heading */}
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Assigned Subjects</h1>

    {/* Error message */}
    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

    {/* Edit Form */}
    {editingSubject && (
        <form onSubmit={handleUpdate} className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit Subject Assignment</h2>
            <div className="space-y-4">
                {/* Subject Name */}
                <div>
                    <label className="block text-gray-600 font-medium">Subject Name</label>
                    <input
                        type="text"
                        name="subject_name"
                        defaultValue={editingSubject.subject_name}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Class Name */}
                <div>
                    <label className="block text-gray-600 font-medium">Class Name</label>
                    <input
                        type="text"
                        name="class_name"
                        defaultValue={editingSubject.class_name}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Section */}
                <div>
                    <label className="block text-gray-600 font-medium">Section</label>
                    <input
                        type="text"
                        name="section"
                        defaultValue={editingSubject.section}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Teacher Username */}
                <div>
                    <label className="block text-gray-600 font-medium">Teacher Username</label>
                    <input
                        type="text"
                        name="teacher_username"
                        defaultValue={editingSubject.teacher_username}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditingSubject(null)}
                        className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    )}

    {/* Subjects Table */}
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
                <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-6 text-left">Subject</th>
                    <th className="py-3 px-6 text-left">Class Name</th>
                    <th className="py-3 px-6 text-left">Section</th>
                    <th className="py-3 px-6 text-left">Teacher</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                {assignedSubjects.length > 0 ? (
                    assignedSubjects.map((subject, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 px-6">{subject.subject_name}</td>
                            <td className="py-3 px-6">{subject.class_name}</td>
                            <td className="py-3 px-6">{subject.section}</td>
                            <td className="py-3 px-6">{subject.teacher_username}</td>
                            <td className="py-3 px-6">
                                <button
                                    onClick={() => handleEdit(subject)}
                                    className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(subject.id)}
                                    className="ml-2 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center py-4">No subjects assigned yet by this admin.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
</div>

    );
};

export default DisplayAssignedSubjectsToTeacher;
