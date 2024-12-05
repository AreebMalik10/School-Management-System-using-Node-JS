import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import ChallanShowParent from './challanShowParent';

export default function Parent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, username } = location.state || {};
  
  const [parentData, setParentData] = useState([]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (username) {
      axios.get(`http://localhost:5000/parent/getParentByUsername`, {
          params: { username }
      })
      .then((response) => {
          setParentData(response.data); // Fetch data for specific parent
      })
      .catch((error) => {
          console.error('Error fetching parent data:', error);
      });
    }
  }, [username]);

  if (!username) {
    return <p>No username provided. Please login first.</p>;
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1>Welcome to the Parent Dashboard</h1>
          <h1 className="text-3xl font-bold mb-4">Welcome, {name}!</h1>
          <p className="text-xl">Username: {username}</p>
          <button 
            onClick={handleLogout} 
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        
        <div>
          <h2>My Profile</h2>
          {parentData ? (
            <table border="1">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Child Username</th>
                  <th>Children Name</th>
                  <th>Occupation</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{parentData.name}</td>
                  <td>{parentData.childUsername}</td>
                  <td>{parentData.childrenName}</td>
                  <td>{parentData.occupation}</td>
                  <td>{parentData.contact}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>Loading parent data...</p>
          )}
        </div>
      </div>

      {/* Pass childUsername as prop to ChallanShowParent */}
      <div>
        {parentData.childUsername && (
          <ChallanShowParent childUsername={parentData.childUsername} />
        )}
      </div>
    </>
  );
}
