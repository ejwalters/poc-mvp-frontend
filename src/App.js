import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';  
import { CssBaseline, Typography, Box, Toolbar, List, ListItem, ListItemText, Drawer, IconButton, Divider } from '@mui/material';  
import { theme } from './theme';  
import Login from './Login';  
import SalesEngineerDashboard from './components/SalesEngineerDashboard';
import Dashboard from './Dashboard';  
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 240;  // Default width of the expanded sidebar

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [access, setAccess] = useState('');  
  const [open, setOpen] = useState(true);  // Drawer state: open or collapsed

  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setAccess(decodedToken.access);
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

  return (
    <ThemeProvider theme={theme}>  
      <CssBaseline />  
      <Box sx={{ display: 'flex' }}>
        
        {/* Collapsible Sidebar Drawer */}
        <Drawer
          sx={{
            width: open ? drawerWidth : 60,  // Adjust width based on whether it's open or collapsed
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : 60,
              boxSizing: 'border-box',
              transition: 'width 0.3s',  // Smooth transition when toggling
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
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem button>
                <DashboardIcon />
                {open && <ListItemText primary="Dashboard Overview" />} {/* Show text only if expanded */}
              </ListItem>
              <ListItem button>
                <DashboardIcon />
                {open && <ListItemText primary="My PoCs" />}
              </ListItem>
              <ListItem button>
                <DashboardIcon />
                {open && <ListItemText primary="Create New PoC" />}
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <LogoutIcon />
                {open && <ListItemText primary="Logout" />}
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            transition: 'margin-left 0.3s',
            width: `calc(100% - ${open ? drawerWidth : 60}px)`,  // Adjust content width based on drawer state
          }}
        >
          <Toolbar />
          <Typography variant="h1" gutterBottom>
            Welcome to the PoC Tracker
          </Typography>
          
          {access === 'sales_engineer' && (
            <SalesEngineerDashboard token={token} /> 
          )}

          {access === 'manager' && (
            <div>
              <Typography variant="h2">Manager Dashboard</Typography>
            </div>
          )}

          {access === 'customer' && (
            <div>
              <Typography variant="h2">Customer Dashboard</Typography>
            </div>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
