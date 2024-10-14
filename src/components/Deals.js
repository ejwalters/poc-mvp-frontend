// src/Deals.js
import React from 'react';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

function Deals({ token, access, deals }) { // deals now come from props
    const navigate = useNavigate(); // Hook for navigation

    const handleAddDeal = () => {
        // Logic for adding a deal (e.g., redirecting to a form or modal to create a new deal)
        console.log('Add Deal button clicked');
    };

    const handleRowClick = (dealId) => {
        navigate(`/deals/${dealId}`); // Navigate to DealDetail using deal's id
    };

    if (!deals) {
        return <CircularProgress />;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>Deals</Typography>

            {/* Conditionally render the Add Deal button for sellers, managers, and sales engineers */}
            {(access === 'seller' || access === 'manager' || access === 'sales_engineer') && (
                <Button variant="contained" color="primary" onClick={handleAddDeal} style={{ marginBottom: '20px' }}>
                    Add Deal
                </Button>
            )}

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Deal Name</TableCell>
                        <TableCell>Client Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deals.map((deal) => (
                        <TableRow
                            key={deal.id}
                            hover
                            onClick={() => handleRowClick(deal.id)} // Handle row click and pass deal ID
                            style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate clickability
                        >
                            <TableCell>{deal.id}</TableCell>
                            <TableCell>{deal.deal_name}</TableCell>
                            <TableCell>{deal.client_name}</TableCell>
                            <TableCell>{deal.status}</TableCell>
                            <TableCell>{new Date(deal.start_date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(deal.end_date).toLocaleDateString()}</TableCell>
                            <TableCell>${deal.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Deals;
