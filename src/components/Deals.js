// src/Deals.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress } from '@mui/material';

function Deals({ token, access }) {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        console.log("Token:" + token);
        const fetchDeals = async () => {
            try {
                const response = await axios.get('http://localhost:5001/deals', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDeals(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (token) {
            fetchDeals();
        }
    }, [token]);

    const handleAddDeal = () => {
        // Logic for adding a deal (e.g., redirecting to a form or modal to create a new deal)
        console.log('Add Deal button clicked');
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="body1" color="error">Error: {error}</Typography>;
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deals.map((deal) => (
                        <TableRow key={deal.id}>
                            <TableCell>{deal.id}</TableCell>
                            <TableCell>{deal.deal_name}</TableCell>
                            <TableCell>{deal.client_name}</TableCell>
                            <TableCell>{deal.status}</TableCell>
                            <TableCell>{new Date(deal.start_date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(deal.end_date).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Deals;
