import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Typography, Box, Toolbar, List, ListItem, ListItemText, Drawer, IconButton, Divider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import { theme } from './theme';
import Login from './Login';
import SalesEngineerDashboard from './components/SalesEngineerDashboard';
import POCTable from './components/POCTable';
import POCDetail from './components/POCDetail';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 240;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [access, setAccess] = useState('');
  const [open, setOpen] = useState(true);
  const [pocs, setPocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setAccess(decodedToken.access);

      // Fetch PoCs
      axios.get('http://localhost:5001/pocs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPocs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching PoCs:', error);
        setLoading(false);
      });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setAccess('');
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  // Fetch specific PoC based on the ID in the route
  const PoCDetailWrapper = () => {
    const { id } = useParams(); // Get PoC ID from route
    const selectedPoC = pocs.find(poc => poc.id === parseInt(id));

    if (!selectedPoC) {
      return <Typography variant="h6">PoC not found.</Typography>;
    }

    return <POCDetail poc={selectedPoC} token={token} />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          {/* Sidebar */}
          <Drawer
            sx={{
              width: open ? drawerWidth : 60,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: open ? drawerWidth : 60,
                boxSizing: 'border-box',
                transition: 'width 0.3s',
              },
            }}
            variant="permanent"
            anchor="left"
            open={open}
          >
            <Toolbar>
              <IconButton onClick={toggleDrawer}>
                {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Toolbar>
            <Divider />
            <List>
              <ListItem button component={Link} to="/">
                <DashboardIcon />
                {open && <ListItemText primary="Dashboard Overview" />}
              </ListItem>
              <ListItem button component={Link} to="/pocs">
                <DashboardIcon />
                {open && <ListItemText primary="My PoCs" />}
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <LogoutIcon />
                {open && <ListItemText primary="Logout" />}
              </ListItem>
            </List>
          </Drawer>

          {/* Main content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              p: 3,
              transition: 'margin-left 0.3s',
              width: `calc(100% - ${open ? drawerWidth : 60}px)`,
            }}
          >
            <Toolbar />
            <Routes>
              <Route path="/" element={(
                <>
                  <Typography variant="h1" gutterBottom>POC Tracker</Typography>
                  {access === 'sales_engineer' && <SalesEngineerDashboard token={token} pocs={pocs} loading={loading} />}
                </>
              )} />

              {/* PoC list route */}
              <Route path="/pocs" element={<POCTable pocs={pocs} token={token} />} />

              {/* PoC detail route */}
              <Route path="/pocs/:id" element={<PoCDetailWrapper />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
