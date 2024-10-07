import React from 'react';
import { Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Navigation hook

const SalesEngineerDashboard = ({ pocs, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return <CircularProgress />;
  }

  // Calculate the total, ongoing, and completed PoCs
  const totalPoCs = pocs.length;
  const ongoingPoCs = pocs.filter(poc => poc.status === 'ongoing').length;
  const completedPoCs = pocs.filter(poc => poc.status === 'completed').length;

  // Handler to navigate to the PoC list with optional status filter
  const handleNavigate = (status) => {
    if (status) {
      navigate(`/pocs?status=${status}`);
    } else {
      navigate('/pocs');
    }
  };

  return (
    <div>
      <Typography variant="h1" gutterBottom>Sales Engineer Dashboard</Typography>

      <Grid container spacing={3}>
        {/* Total PoCs card */}
        <Grid item xs={12} sm={4}>
          <Card onClick={() => handleNavigate()} style={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Total PoCs</Typography>
              <Typography variant="h4">{totalPoCs}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Ongoing PoCs card */}
        <Grid item xs={12} sm={4}>
          <Card onClick={() => handleNavigate('ongoing')} style={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Ongoing PoCs</Typography>
              <Typography variant="h4">{ongoingPoCs}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Completed PoCs card */}
        <Grid item xs={12} sm={4}>
          <Card onClick={() => handleNavigate('completed')} style={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Completed PoCs</Typography>
              <Typography variant="h4">{completedPoCs}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SalesEngineerDashboard;
