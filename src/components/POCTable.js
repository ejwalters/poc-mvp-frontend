import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Use useNavigate

const POCTable = ({ pocs, token, onBackToDashboard }) => {
  const [filteredPoCs, setFilteredPoCs] = useState([]);
  const [searchParams] = useSearchParams(); // Access query params
  const navigate = useNavigate(); // Use for navigation

  useEffect(() => {
    // Extract status from query parameters
    const status = searchParams.get('status');

    // Filter based on status query parameter
    if (status) {
      const filtered = pocs.filter((poc) => poc.status === status);
      setFilteredPoCs(filtered);
    } else {
      // If no status is present, show all PoCs
      setFilteredPoCs(pocs);
    }
  }, [pocs, searchParams]);

  const handleRowClick = (poc) => {
    // Navigate to PoC detail page
    navigate(`/pocs/${poc.id}`);
  };

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {searchParams.get('status') ? `${searchParams.get('status')} PoCs` : 'All PoCs'}
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
            {filteredPoCs.map((poc) => (
              <TableRow 
                key={poc.id} 
                hover 
                style={{ cursor: 'pointer' }} 
                onClick={() => handleRowClick(poc)} // Trigger row click navigation
              >
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
