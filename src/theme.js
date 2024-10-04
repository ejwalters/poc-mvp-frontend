import { createTheme } from '@mui/material/styles';

// Define the color palette here so you can easily edit it later
export const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',  // Default primary color
    },
    secondary: {
      main: '#6c757d',  // Default secondary color
    },
    background: {
      default: '#f8f9fa',  // Default background
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});
