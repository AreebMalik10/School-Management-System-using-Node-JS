import React, { useState } from 'react';
import axios from 'axios';

export default function CreateStudent() {
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        registrationNo: '',
        dob: '',
        age: '',
        className: '',
        section: '',
        contact: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/admin/create-student', formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        }).then(response => {
            alert('Student created successfully.');
        }).catch(error => {
            console.error('Error creating student:', error);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Student Name" required />
            <input type='text' name="father name" value={formData.fatherName} onChange={handleChange} placeholder='Father Name' required />
            <input type='text' name='registration no' value={formData.registrationNo} onChange={handleChange} placeholder='Registration No' required />
            <input type="number" name='dob' value={formData.dob} onChange={handleChange} placeholder='DoB' required />
            <input type="text" name='age' value={formData.age} onChange={handleChange} placeholder='Age' required />
            <input type="text" name='classname' value={formData.className} onChange={handleChange} placeholder='Classname' required />
            <input type="number" name='section' value={formData.section} onChange={handleChange} placeholder='Section' required />
            <input type="number" name='contact' value={formData.contact} onChange={handleChange} placeholder='Contact' required />
            <input type="text" name='email' value={formData.email} onChange={handleChange} placeholder='Email' required />
            <input type="text" name='password' value={formData.password} onChange={handleChange} placeholder='Password' required />

            {/* Similar inputs for fatherName, registrationNo, etc. */}
            <button type="submit">Create Student</button>
        </form>
    );
}
