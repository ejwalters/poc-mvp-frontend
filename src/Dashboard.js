import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ token, access }) => {
  const [pocs, setPocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setPocs(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, [token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (access === 'sales_engineer') {
    return (
      <div>
        <h1>Your PoCs</h1>
        <ul>
          {pocs.map(poc => (
            <li key={poc.id}>
              {poc.poc_name} - {poc.customer_name} (Status: {poc.status})
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (access === 'manager') {
    return (
      <div>
        <h1>Team's PoCs</h1>
        <ul>
          {pocs.map(poc => (
            <li key={poc.id}>
              {poc.poc_name} - {poc.customer_name} (Created by: {poc.first_name} {poc.last_name}, Status: {poc.status})
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (access === 'customer') {
    return (
      <div>
        <h1>Your PoC</h1>
        <ul>
          {pocs.map(poc => (
            <li key={poc.id}>
              {poc.poc_name} (Status: {poc.status})
              <button>Add Comment</button> {/* Add custom functionality for customers */}
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return <p>Access denied</p>;
  }
};

export default Dashboard;
