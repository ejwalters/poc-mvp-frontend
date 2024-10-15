import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Avatar, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const DealStakeholders = ({ dealId, token }) => {
    const [stakeholders, setStakeholders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch external stakeholders for the deal
    useEffect(() => {
        const fetchStakeholders = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/deals/${dealId}/stakeholders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStakeholders(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching stakeholders');
                setLoading(false);
            }
        };

        fetchStakeholders();
    }, [dealId, token]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="body1" color="error">{error}</Typography>;

    return (
        <div style={{ marginBottom: '20px' }}>
            <Typography variant="h5" gutterBottom>Key Client Stakeholders</Typography>
            <Grid container spacing={2}>
                {stakeholders.map((person, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', marginRight: 2 }}>
                                <PersonIcon />
                            </Avatar>
                            <CardContent sx={{ padding: '8px 0' }}>
                                <Typography variant="subtitle1">{person.stakeholder_name}</Typography>
                                <Typography variant="body2" color="textSecondary">{person.role}</Typography>
                                <Typography variant="caption" color="textSecondary">{person.status}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default DealStakeholders;
