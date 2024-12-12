import React,{useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';

export default function TeacherViewLeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const { name, username } = location.state || {};

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/teacher/get-leave-requests?username=${username}`
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

  // Update leave request status
  const updateLeaveStatus = async (leaveRequestId, status) => {
    try {
      const response = await fetch(
        "http://localhost:5000/teacher/update-leave-request-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ leaveRequestId, status }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchLeaveRequests(); // Refresh the leave requests
      } else {
        alert(data.message || "Error updating leave request");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update leave request");
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  return (
    <>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">
        Leave Requests For Your Classes Students {username}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading leave requests...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : leaveRequests.length === 0 ? (
        <p className="text-center text-gray-500">No leave requests found.</p>
      ) : (
        <div className="space-y-4">
          {leaveRequests.map((leave) => (
            <div
              key={leave.id}
              className="p-4 bg-white shadow rounded flex flex-col md:flex-row justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Student Username: {leave.student_username}
                </p>
                <p className="font-semibold">
                    Student Class: {leave.class_name}
                </p>
                <p className='font-semibold'>
                    Student Section: {leave.section}
                </p>
                <p>Reason: {leave.reason}</p>
                <p>
                  Dates: {leave.startDate} to {leave.endDate}
                </p>
                <p className='text-red-600'>Status: {leave.status}</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <button
                  onClick={() => updateLeaveStatus(leave.id, "approved")}
                  className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                  disabled={leave.status === "approved"}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateLeaveStatus(leave.id, "rejected")}
                  className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                  disabled={leave.status === "rejected"}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}
