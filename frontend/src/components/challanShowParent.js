import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChallanShowParent = ({ childUsername }) => {
  const [challanData, setChallanData] = useState([]);

  useEffect(() => {
    if (childUsername) {
      // Make the API call using the childUsername
      axios.get('http://localhost:5000/parent/getParentChallanDetails', {
        params: { childUsername } // Pass childUsername as query parameter
      })
      .then((response) => {
        setChallanData(response.data); // Set the received challan data
      })
      .catch((error) => {
        console.error('Error fetching challan data:', error);
      });
    }
  }, [childUsername]); // Trigger effect when childUsername changes

  return (
    <div>
      <h1>Challan</h1>
      <h3>Child Username: {childUsername}</h3>
      {challanData.length > 0 ? (
        <div>
          <h3>Challan Details:</h3>
          <ul>
            {challanData.map((challan) => (
              <li key={challan.id}>
                <p>Fee Amount: {challan.fee_amount}</p>
                <p>Challan Month: {challan.challan_month}</p>
                <p>Fine Amount: {challan.fine_amount}</p>
                <p>Others Expense: {challan.others_expense}</p>
                <p>Total Amount: {challan.total_amount}</p>
                <p>Due Date: {challan.due_date}</p>
                <p>Challan Description: {challan.challan_description}</p>
                <p>Status: {challan.status}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No matching challans found for this child.</p>
      )}
    </div>
  );
};

export default ChallanShowParent;
