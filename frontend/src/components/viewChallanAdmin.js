import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewChallanAdmin = () => {
    const [challans, setChallans] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('adminEmail');
        
        if (!email) {
            navigate('/adminlogin');  // Redirect if admin email not found
        } else {
            // Fetch the challans created by the logged-in admin
            axios.get('http://localhost:5000/admin1/getChallansByAdmin', {
                params: { adminEmail: email }
            })
            .then(response => {
                setChallans(response.data); // Set fetched challans data
            })
            .catch(error => {
                console.error(error);
                setMessage('Error fetching challans.');
            });
        }
    }, [navigate]);

    // Update Challan Status
    const handleStatusUpdate = (challanId, newStatus) => {
        console.log('Updating status to:', newStatus); // Log for debugging
    
        axios.put('http://localhost:5000/admin1/updateChallan', {
            challanId,
            status: newStatus
        })
        .then(response => {
            setMessage('Challan status updated successfully');
            // Refresh the challans list after update
            setChallans(prevChallans => prevChallans.map(challan => 
                challan.id === challanId ? { ...challan, status: newStatus } : challan
            ));
        })
        .catch(error => {
            console.error(error);
            setMessage('Error updating challan status');
        });
    };
    

    // Delete Challan
    const handleDelete = (challanId) => {
        axios.delete('http://localhost:5000/admin1/deleteChallan', {
            data: { challanId }
        })
        .then(response => {
            setMessage('Challan deleted successfully');
            // Remove the deleted challan from the list
            setChallans(prevChallans => prevChallans.filter(challan => challan.id !== challanId));
        })
        .catch(error => {
            console.error(error);
            setMessage('Error deleting challan');
        });
    };

    return (
        <div>
            <h2>Admin Challans</h2>
            {message && <p>{message}</p>} {/* Display error message if any */}
            {challans.length === 0 ? (
                <p>No challans created by this admin yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Student Username</th>
                            <th>Fee Amount</th>
                            <th>Challan Month</th>
                            <th>Fine Amount</th>
                            <th>Total Amount</th>
                            <th>Others Expense</th>
                            <th>Challan Description</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {challans.map(challan => (
                            <tr key={challan.id}>
                                <td>{challan.username}</td>
                                <td>{challan.fee_amount}</td>
                                <td>{challan.challan_month}</td>
                                <td>{challan.fine_amount}</td>
                                <td>{challan.total_amount}</td>
                                <td>{challan.others_expense}</td>
                                <td>{challan.challan_description}</td>
                                <td>{challan.due_date}</td>
                                <td>{challan.status}</td>
                                <td>
                                    {/* Button to update status */}
                                    <button onClick={() => handleStatusUpdate(challan.id, 'Paid')}>Mark as Paid</button>
                                    <button onClick={() => handleStatusUpdate(challan.id, 'Pending')}>Mark as Pending</button>

                                    {/* Button to delete challan */}
                                    <button onClick={() => handleDelete(challan.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewChallanAdmin;
