// fetchTeacherLeaveRequests.js

import axios from 'axios';

const FetchTeacherLeaveRequests = async (teacherId) => {
    if (!teacherId) {
        console.log('No teacherId provided');
        return { leaveRequests: [] };  // Agar teacherId nahi hai to empty array return karenge
    }

    try {
        console.log('Fetching leave requests for teacherId:', teacherId);
        const response = await axios.get(`http://localhost:5000/teacher/viewTeacherLeaveRequests?teacherId=${teacherId}`);
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        return { leaveRequests: [] };  // Error hone par bhi empty array return karenge
    }
};

export default FetchTeacherLeaveRequests;
