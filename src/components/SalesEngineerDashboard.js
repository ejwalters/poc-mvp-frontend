import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import POCTable from './POCTable'; // Import POCTable

const SalesEngineerDashboard = ({ token }) => {
  const [pocs, setPocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard'); // Track view: 'dashboard', 'total', 'ongoing', 'completed'
  const [filteredPoCs, setFilteredPoCs] = useState([]); // Track the PoCs to display

  useEffect(() => {
    // Fetch the PoCs from the backend
    axios.get('http://localhost:5000/pocs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setPocs(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('There was an error fetching the PoCs!', error);
      setLoading(false);
    });
  }, [token]);

  if (loading) {
    return <CircularProgress />;
  }

  // Handle click to show Total PoCs
  const handleShowTotalPoCTable = () => {
    setFilteredPoCs(pocs); // Pass all PoCs for total
    setView('total'); // Set view to 'total'
  };

  // Handle click to show Ongoing PoCs
  const handleShowOngoingPoCTable = () => {
    setFilteredPoCs(pocs.filter(poc => poc.status === 'ongoing')); // Filter Ongoing PoCs
    setView('ongoing'); // Set view to 'ongoing'
  };

  // Handle click to show Completed PoCs
  const handleShowCompletedPoCTable = () => {
    setFilteredPoCs(pocs.filter(poc => poc.status === 'completed')); // Filter Completed PoCs
    setView('completed'); // Set view to 'completed'
  };

  // Handle go back to dashboard view
  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  return (
    <div>
      {view === 'dashboard' ? (
        <>
          {/* Dashboard View */}
          <Typography variant="h1" gutterBottom>
            Sales Engineer Dashboard
          </Typography>

          {/* Display the PoC Summary */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card onClick={handleShowTotalPoCTable} style={{ cursor: 'pointer' }}> {/* Make card clickable */}
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Total PoCs
                  </Typography>
                  <Typography variant="h4">
                    {pocs.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card onClick={handleShowOngoingPoCTable} style={{ cursor: 'pointer' }}> {/* Make card clickable */}
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Ongoing PoCs
                  </Typography>
                  <Typography variant="h4">
                    {pocs.filter(poc => poc.status === 'ongoing').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card onClick={handleShowCompletedPoCTable} style={{ cursor: 'pointer' }}> {/* Make card clickable */}
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Completed PoCs
                  </Typography>
                  <Typography variant="h4">
                    {pocs.filter(poc => poc.status === 'completed').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Display Total Dollar Value of Ongoing PoCs */}
          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Total Dollar Value of Ongoing PoCs
                  </Typography>
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    ${pocs
                      .filter(poc => poc.status === 'ongoing')
                      .reduce((sum, poc) => sum + (poc.dollar_value ? Number(poc.dollar_value) : 0), 0)
                      .toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        // Render the POCTable component when the user clicks on any PoC type
        <POCTable pocs={filteredPoCs} token={token} onBackToDashboard={handleBackToDashboard} />
      )}
    </div>
  );
};

export default SalesEngineerDashboard;
