import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import POCDetail from './POCDetail'; // Import the PoCDetail component

const POCTable = ({ pocs, token, onBackToDashboard }) => {
  const [selectedPoC, setSelectedPoC] = useState(null);  // State to track selected PoC for detail view

  // Handle clicking on a specific PoC
  const handleRowClick = (poc) => {
    setSelectedPoC(poc);
  };

  // Handle returning to the table from PoC detail view
  const handleBackToTable = () => {
    setSelectedPoC(null);
  };

  if (selectedPoC) {
    // Render the PoCDetail component if a PoC is selected
    return <POCDetail poc={selectedPoC} token={token} onBackToTable={handleBackToTable} />;
  }

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        All PoCs
      </Typography>
      <Button variant="contained" color="primary" onClick={onBackToDashboard}>
        Back to Dashboard
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PoC Name</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Dollar Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pocs.map((poc) => (
              <TableRow key={poc.id} hover onClick={() => handleRowClick(poc)} style={{ cursor: 'pointer' }}>
                <TableCell>{poc.poc_name}</TableCell>
                <TableCell>{poc.customer_name}</TableCell>
                <TableCell>{poc.status}</TableCell>
                <TableCell>{new Date(poc.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(poc.end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {poc.dollar_value !== null && poc.dollar_value !== undefined && !isNaN(poc.dollar_value)
                    ? `$${Number(poc.dollar_value).toFixed(2)}`
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default POCTable;
