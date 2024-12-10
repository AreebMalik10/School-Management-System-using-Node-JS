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
        <div className="max-w-8xl mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Challans</h2>

            {/* Message Display */}
            {message && (
                <p className="text-red-600 bg-red-100 border border-red-200 p-3 rounded mb-4">
                    {message}
                </p>
            )}

            {/* Table */}
            {challans.length === 0 ? (
                <p className="text-lg text-gray-500">No challans created by this admin yet.</p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-2 border">Student Username</th>
                                <th className="px-4 py-2 border">Fee Amount</th>
                                <th className="px-4 py-2 border">Challan Month</th>
                                <th className="px-4 py-2 border">Fine Amount</th>
                                <th className="px-4 py-2 border">Total Amount</th>
                                <th className="px-4 py-2 border">Others Expense</th>
                                <th className="px-4 py-2 border">Challan Description</th>
                                <th className="px-4 py-2 border">Due Date</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {challans.map(challan => (
                                <tr key={challan.id} className="bg-gray-50 hover:bg-gray-100 transition duration-200">
                                    <td className="px-4 py-2 border">{challan.username}</td>
                                    <td className="px-4 py-2 border">{challan.fee_amount}</td>
                                    <td className="px-4 py-2 border">{challan.challan_month}</td>
                                    <td className="px-4 py-2 border">{challan.fine_amount}</td>
                                    <td className="px-4 py-2 border">{challan.total_amount}</td>
                                    <td className="px-4 py-2 border">{challan.others_expense}</td>
                                    <td className="px-4 py-2 border">{challan.challan_description}</td>
                                    <td className="px-4 py-2 border">{challan.due_date}</td>
                                    <td className="px-4 py-2 border">{challan.status}</td>
                                    <td className="px-4 py-2 border flex gap-2">
                                        {/* Button to update status */}
                                        <button
                                            onClick={() => handleStatusUpdate(challan.id, 'Paid')}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                                        >
                                            Mark as Paid
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(challan.id, 'Pending')}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                        >
                                            Mark as Pending
                                        </button>

                                        {/* Button to delete challan */}
                                        <button
                                            onClick={() => handleDelete(challan.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

    );
};

export default ViewChallanAdmin;
