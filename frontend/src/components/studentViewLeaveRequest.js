import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function StudentViewLeaveRequest() {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const location = useLocation();
    const { name, username } = location.state || {};

    // Fetch leave requests
    const fetchLeaveRequests = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/student/get-leave-request-by-student?username=${username}`
            );
            const data = await response.json();

            if (response.ok) {
                setLeaveRequests(data.leaveRequests);
            } else {
                setError(data.message || "Error fetching leave requests");
            }
        } catch (err) {
            setError("Failed to fetch leave requests");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, []);


    return (
        <>
            <div className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
                    My Leave Requests
                </h1>

                {loading ? (
                    <p className="text-center text-gray-500">Loading leave requests...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : leaveRequests.length === 0 ? (
                    <p className="text-center text-gray-500">No leave requests found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leaveRequests.map((leave) => (
                            <div
                                key={leave.id}
                                className="p-4 bg-white shadow-lg rounded-lg transform transition duration-300 hover:scale-105"
                            >
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-gray-700 mb-2">
                                        {leave.student_username}
                                    </h2>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Reason:</span> {leave.reason}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Dates:</span>{" "}
                                        {leave.startDate} to {leave.endDate}
                                    </p>
                                </div>
                                <div>
                                    <p
                                        className={`text-center py-2 px-4 rounded-full font-semibold text-sm ${leave.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : leave.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        Status: {leave.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </>
    )
}
