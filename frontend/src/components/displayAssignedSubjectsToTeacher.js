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
        <div>
            <h1>Assigned Subjects</h1>
            {error && <p>{error}</p>}

            {/* Edit form */}
            {editingSubject && (
                <form onSubmit={handleUpdate}>
                    <h2>Edit Subject Assignment</h2>
                    <input 
                        type="text" 
                        name="subject_name" 
                        defaultValue={editingSubject.subject_name} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="class_name" 
                        defaultValue={editingSubject.class_name} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="section" 
                        defaultValue={editingSubject.section} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="teacher_username" 
                        defaultValue={editingSubject.teacher_username} 
                        required 
                    />
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setEditingSubject(null)}>Cancel</button>
                </form>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Class Name</th>
                        <th>Section</th>
                        <th>Teacher</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignedSubjects.length > 0 ? (
                        assignedSubjects.map((subject, index) => (
                            <tr key={index}>
                                <td>{subject.subject_name}</td>
                                <td>{subject.class_name}</td>
                                <td>{subject.section}</td>
                                <td>{subject.teacher_username}</td>
                                <td>
                                    <button onClick={() => handleEdit(subject)}>Edit</button>
                                    <button onClick={() => handleDelete(subject.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No subjects assigned yet by this admin.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DisplayAssignedSubjectsToTeacher;
