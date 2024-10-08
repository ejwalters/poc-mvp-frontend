import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Typography, Box, Toolbar, List, ListItem, ListItemText, Drawer, IconButton, Divider, ListItemIcon, TextField, InputAdornment, Badge, Avatar } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
import { theme } from './theme';
import Login from './Login';
import SalesEngineerDashboard from './components/SalesEngineerDashboard';
import POCTable from './components/POCTable';
import POCDetail from './components/POCDetail';
import Deals from './components/Deals'; // Import the Deals component
import { Home, BarChart, Notifications, Settings, Support, Search, Logout } from '@mui/icons-material';
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

  const toggleDrawer = () => {
    setOpen(!open);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent
          token={token}
          access={access}
          pocs={pocs}
          setToken={setToken}
          setAccess={setAccess}
          loading={loading}
          toggleDrawer={toggleDrawer}
          open={open}
        />
      </Router>
    </ThemeProvider>
  );
};

const AppContent = ({ token, access, pocs, setToken, setAccess, loading, toggleDrawer, open }) => {
  const navigate = useNavigate(); // Move useNavigate here

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setAccess('');
    navigate('/'); // Redirect to login route
  };

  const PoCDetailWrapper = () => {
    const { id } = useParams(); // Get PoC ID from route
    const selectedPoC = pocs.find(poc => poc.id === parseInt(id));

    if (!selectedPoC) {
      return <Typography variant="h6">PoC not found.</Typography>;
    }

    return <POCDetail poc={selectedPoC} token={token} />;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            boxSizing: 'border-box',
            backgroundColor: '#0a0e2e',  // Navy background
            color: '#fff',  // White text
            transition: 'width 0.3s',
          },
        }}
        variant="permanent"
        anchor="left"
        open={open}
      >
        <Toolbar>
          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronLeftIcon sx={{ color: '#fff' }} /> : <ChevronRightIcon sx={{ color: '#fff' }} />}
          </IconButton>
        </Toolbar>

        <Box sx={{ p: 2 }}>
          {!open ? (
            // Center the magnifying glass vertically and horizontally when the drawer is folded
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <IconButton onClick={toggleDrawer}>
                <Search sx={{ fontSize: '1.5rem', color: '#fff' }} />
              </IconButton>
            </Box>
          ) : (
            // Show the full search input when the drawer is open
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search..."
              sx={{
                mb: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',  // Slightly darker background for contrast
                borderRadius: '8px',
                '.MuiOutlinedInput-root': {
                  height: '36px',
                  padding: '0px',
                  '& fieldset': {
                    borderRadius: '8px',
                    borderColor: 'transparent', // No border
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  input: {
                    padding: '0px 12px',  // Adjust padding for the input text
                    color: '#fff',  // White text for dark mode
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ paddingLeft: '8px' }}> {/* Added paddingLeft */}
                    <Search sx={{ fontSize: '1rem', color: '#fff' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Box>


        <Divider />

        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon><Home sx={{ color: '#fff' }} /></ListItemIcon>
            {open && <ListItemText primary="Dashboard Overview" sx={{ color: '#fff' }} />}
          </ListItem>

          <ListItem button component={Link} to="/pocs">
            <ListItemIcon><BarChart sx={{ color: '#fff' }} /></ListItemIcon>
            {open && <ListItemText primary="My POCs" sx={{ color: '#fff' }} />}
          </ListItem>

          {/* Add the Deals section to the sidebar */}
          <ListItem button component={Link} to="/deals">
            <ListItemIcon><BarChart sx={{ color: '#fff' }} /></ListItemIcon>
            {open && <ListItemText primary="Deals" sx={{ color: '#fff' }} />}
          </ListItem>

          <ListItem button component={Link} to="#">
            <ListItemIcon><Notifications sx={{ color: '#fff' }} /></ListItemIcon>
            {open && (
              <Badge badgeContent={4} color="error">
                <ListItemText primary="Notifications" sx={{ color: '#fff' }} />
              </Badge>
            )}
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <ListItem button component={Link} to="#">
            <ListItemIcon><Settings sx={{ color: '#fff' }} /></ListItemIcon>
            {open && <ListItemText primary="Setting" sx={{ color: '#fff' }} />}
          </ListItem>

          <ListItem button component={Link} to="#">
            <ListItemIcon><Support sx={{ color: '#fff' }} /></ListItemIcon>
            {open && <ListItemText primary="Support" sx={{ color: '#fff' }} />}
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* User Profile Section */}
          <ListItem
            sx={{
              mt: 'auto',
              p: open ? 2 : 1, // Adjust padding based on drawer state
              display: 'flex',
              alignItems: 'center',
              justifyContent: open ? 'space-between' : 'center', // Center the avatar when folded
              flexDirection: open ? 'row' : 'column', // Stack avatar in the middle when closed
            }}
          >
            <Box display="flex" alignItems="center" sx={{ gap: open ? 1 : 0 }}>
              <Avatar
                alt="User"
                src="/static/images/avatar/1.jpg"
                sx={{
                  width: open ? 32 : 32, // Adjust avatar size based on drawer state
                  height: open ? 32 : 32,
                }}
              /> {/* Larger Avatar when closed */}

              {open && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>John Doe</Typography> {/* Smaller font */}
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'gray' }}>john@example.com</Typography> {/* Smaller email text */}
                </Box>
              )}
            </Box>
            {open && (
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <Logout
                  sx={{
                    fontSize: '1rem',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                  onClick={handleLogout}
                /> {/* Hide Logout icon when drawer is folded */}
              </ListItemIcon>
            )}
          </ListItem>

        </List>
      </Drawer>

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

          {/* Add the Deals route */}
          <Route path="/deals" element={<Deals token={token} access={access} />} />

          {/* PoC detail route */}
          <Route path="/pocs/:id" element={<PoCDetailWrapper />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
