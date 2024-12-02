import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";


export default function Teacher() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, username } = location.state || {};

    useEffect(() => {
        // Check if token is available in localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
            // If no token, redirect to login page
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/');
      };

      const [teacherUsername, setTeacherUsername] = useState('');
      const [reason, setReason] = useState('');
      const [startDate, setStartDate] = useState('');
      const [endDate, setEndDate] = useState('');
      const [message, setMessage] = useState('');
  
      const handleSubmit = async (e) => {
          e.preventDefault();
  
          // Basic validation
          if (!teacherUsername || !reason || !startDate || !endDate) {
              setMessage('All fields are required');
              return;
          }
  
          try {
              const response = await axios.post('http://localhost:5000/teacher/createLeaveRequest', {
                  teacherUsername,
                  reason,
                  startDate,
                  endDate,
              });
  
              // Handle success response
              setMessage(response.data.message);
          } catch (error) {
              // Handle error response
              setMessage(error.response?.data?.message || 'Something went wrong');
          }
      };

      const [leaveRequests, setLeaveRequests] = useState([]);
    const [error, setError] = useState(null);

    // Get teacherId from sessionStorage (assuming the teacher is logged in)
    const teacherId = sessionStorage.getItem("teacherId");

    useEffect(() => {
        if (teacherId) {
            fetchLeaveRequests(teacherId);  // Fetch leave requests for the logged-in teacher
        } else {
            setError("Teacher ID is not found");
        }
    }, [teacherId]);

    const fetchLeaveRequests = async (teacherId) => {
        try {
            console.log(`Fetching leave requests for teacherId: ${teacherId}`);
            const response = await axios.get(`http://localhost:5000/teacher/viewTeacherLeaveRequests`, {
                params: { teacherId: teacherId },
            });
            console.log("Leave Requests:", response.data.leaveRequests);
            setLeaveRequests(response.data.leaveRequests);
        } catch (err) {
            console.error("Error fetching leave requests:", err);
            setError("Failed to fetch leave requests");
        }
    };
  
  
  


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <h1>Welcome to the Teacher Dashboard</h1>
      <h1 className="text-3xl font-bold mb-4">Welcome, {name}!</h1>
      <p className="text-xl">Username: {username}</p>

      <button 
          onClick={handleLogout} 
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
    </div>

    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Create Leave Request</h2>
            
            {/* Form */}
            <form onSubmit={handleSubmit}>
                {/* Teacher Username */}
                <div className="mb-4">
                    <label htmlFor="teacherUsername" className="block text-gray-700 font-medium mb-2">
                        Teacher Username
                    </label>
                    <input
                        type="text"
                        id="teacherUsername"
                        value={teacherUsername}
                        onChange={(e) => setTeacherUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Reason */}
                <div className="mb-4">
                    <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
                        Reason for Leave
                    </label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Start Date */}
                <div className="mb-4">
                    <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* End Date */}
                <div className="mb-4">
                    <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Submit Leave Request
                </button>
            </form>

            {/* Message */}
            {message && <p className="text-center mt-4 text-red-600">{message}</p>}
        </div>

        
        <div>
            <h1>Teacher Leave Requests</h1>
            {error && <p>{error}</p>}
            {leaveRequests.length === 0 ? (
                <p>No leave requests found</p>
            ) : (
                <ul>
                    {leaveRequests.map((request) => (
                        <li key={request.id}>
                            {request.reason} ({request.status}) from {request.startDate} to {request.endDate}
                        </li>
                    ))}
                </ul>
            )}
        </div>


             
  </div>
  
  )
}
