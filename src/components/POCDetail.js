import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import axios from 'axios';

const POCDetail = ({ poc, onBackToTable, token }) => {
  const [contacts, setContacts] = useState([]);
  const [capabilities, setCapabilities] = useState([]);  // Store capabilities
  const [useCases, setUseCases] = useState([]);  // Store use cases
  const [successCriteria, setSuccessCriteria] = useState([]);  // Store success criteria
  const [openDialog, setOpenDialog] = useState(false);
  const [openCapabilityDialog, setOpenCapabilityDialog] = useState(false);  // Modal for capabilities
  const [openUseCaseDialog, setOpenUseCaseDialog] = useState(false);  // Modal for use cases
  const [openSuccessCriteriaDialog, setOpenSuccessCriteriaDialog] = useState(false);  // Modal for success criteria
  const [newContact, setNewContact] = useState({ contact_name: '', contact_email: '', role: '', status: '' });
  const [newCapability, setNewCapability] = useState('');  // State for new capability
  const [newUseCase, setNewUseCase] = useState('');  // State for new use case
  const [newSuccessCriteria, setNewSuccessCriteria] = useState('');  // State for new success criterion

  useEffect(() => {
    // Fetch customer contacts
    axios.get(`http://localhost:5001/pocs/${poc.id}/contacts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setContacts(response.data);
    })
    .catch(error => {
      console.error('Error fetching customer contacts', error.response?.data);
    });

    // Fetch required capabilities
    axios.get(`http://localhost:5001/pocs/${poc.id}/capabilities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setCapabilities(response.data);
    })
    .catch(error => {
      console.error('Error fetching capabilities', error.response?.data);
    });

    // Fetch use cases
    axios.get(`http://localhost:5001/pocs/${poc.id}/use_cases`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setUseCases(response.data);
    })
    .catch(error => {
      console.error('Error fetching use cases', error.response?.data);
    });

    // Fetch success criteria
    axios.get(`http://localhost:5001/pocs/${poc.id}/success_criteria`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setSuccessCriteria(response.data);
    })
    .catch(error => {
      console.error('Error fetching success criteria', error.response?.data);
    });
  }, [poc.id, token]);

  // Handle opening and closing of the dialogs
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenCapabilityDialog = () => setOpenCapabilityDialog(true);
  const handleCloseCapabilityDialog = () => setOpenCapabilityDialog(false);
  const handleOpenUseCaseDialog = () => setOpenUseCaseDialog(true);
  const handleCloseUseCaseDialog = () => setOpenUseCaseDialog(false);
  const handleOpenSuccessCriteriaDialog = () => setOpenSuccessCriteriaDialog(true);
  const handleCloseSuccessCriteriaDialog = () => setOpenSuccessCriteriaDialog(false);

  // Handle input changes for the new contact form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle input changes for the new capability form
  const handleCapabilityInputChange = (e) => {
    setNewCapability(e.target.value);
  };

  // Handle input changes for the new use case form
  const handleUseCaseInputChange = (e) => {
    setNewUseCase(e.target.value);
  };

  // Handle input changes for the new success criteria form
  const handleSuccessCriteriaInputChange = (e) => {
    setNewSuccessCriteria(e.target.value);
  };

  // Handle form submission to add a new contact
  const handleAddContact = () => {
    if (!newContact.contact_name || !newContact.contact_email || !newContact.role || !newContact.status) {
      console.error('Please fill out all fields');
      return;
    }

    axios.post(`http://localhost:5001/pocs/${poc.id}/contacts`, newContact, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setContacts([...contacts, response.data]); // Add the new contact to the list
      handleCloseDialog(); // Close the dialog
    })
    .catch(error => {
      console.error('Error adding contact', error); // Log any errors
    });
  };

  // Handle form submission to add a new capability
  const handleAddCapability = () => {
    if (!newCapability) {
      console.error('Capability description is required');
      return;
    }

    axios.post(`http://localhost:5001/pocs/${poc.id}/capabilities`, { capability_description: newCapability }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setCapabilities([...capabilities, response.data]); // Add the new capability to the list
      handleCloseCapabilityDialog(); // Close the dialog
      setNewCapability('');  // Reset the capability input
    })
    .catch(error => {
      console.error('Error adding capability', error);
    });
  };

  // Handle form submission to add a new use case
  const handleAddUseCase = () => {
    if (!newUseCase) {
      console.error('Use case description is required');
      return;
    }

    axios.post(`http://localhost:5001/pocs/${poc.id}/use_cases`, { use_case_description: newUseCase }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setUseCases([...useCases, response.data]); // Add the new use case to the list
      handleCloseUseCaseDialog(); // Close the dialog
      setNewUseCase('');  // Reset the use case input
    })
    .catch(error => {
      console.error('Error adding use case', error);
    });
  };

  // Handle form submission to add a new success criteria
  const handleAddSuccessCriteria = () => {
    if (!newSuccessCriteria) {
      console.error('Success criteria description is required');
      return;
    }

    axios.post(`http://localhost:5001/pocs/${poc.id}/success_criteria`, { criteria_description: newSuccessCriteria }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setSuccessCriteria([...successCriteria, response.data]); // Add the new success criteria to the list
      handleCloseSuccessCriteriaDialog(); // Close the dialog
      setNewSuccessCriteria('');  // Reset the success criteria input
    })
    .catch(error => {
      console.error('Error adding success criteria', error);
    });
  };

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {poc.poc_name} Details
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Customer: {poc.customer_name}
          </Typography>
          <Typography variant="body1">
            Status: {poc.status}
          </Typography>
          <Typography variant="body1">
            Start Date: {new Date(poc.start_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            End Date: {new Date(poc.end_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            Dollar Value: ${poc.dollar_value ? Number(poc.dollar_value).toFixed(2) : 'N/A'}
          </Typography>
        </CardContent>
      </Card>

      {/* Success Criteria Section */}
      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
        Success Criteria
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Criteria Description</TableCell>
              <TableCell>Met</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {successCriteria.map(criteria => (
              <TableRow key={criteria.id}>
                <TableCell>{criteria.criteria_description}</TableCell>
                <TableCell>{criteria.is_met ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Success Criteria Button */}
      <Button variant="contained" color="primary" onClick={handleOpenSuccessCriteriaDialog} style={{ marginTop: '20px' }}>
        Add Success Criteria
      </Button>

      {/* Add Success Criteria Dialog */}
      <Dialog open={openSuccessCriteriaDialog} onClose={handleCloseSuccessCriteriaDialog}>
        <DialogTitle>Add Success Criteria</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Criteria Description"
            fullWidth
            value={newSuccessCriteria}
            onChange={handleSuccessCriteriaInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessCriteriaDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSuccessCriteria} color="primary">
            Add Criteria
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer Contacts Section */}
      {/* Keep other sections such as Customer Contacts, Capabilities, Use Cases */}
      {/* Customer Contacts Section */}
      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
        Customer Contacts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map(contact => (
              <TableRow key={contact.id}>
                <TableCell>{contact.contact_name}</TableCell>
                <TableCell>{contact.contact_email}</TableCell>
                <TableCell>{contact.role}</TableCell>
                <TableCell>{contact.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Contact Button */}
      <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginTop: '20px' }}>
        Add Customer Contact
      </Button>

      {/* Add Contact Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Customer Contact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="contact_name"
            label="Contact Name"
            fullWidth
            value={newContact.contact_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="contact_email"
            label="Contact Email"
            fullWidth
            value={newContact.contact_email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="role"
            label="Role"
            fullWidth
            value={newContact.role}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="status"
            label="Status (champion, detractor, neutral, coach)"
            fullWidth
            value={newContact.status}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddContact} color="primary">
            Add Contact
          </Button>
        </DialogActions>
      </Dialog>

      {/* Required Capabilities Section */}
      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
        Required Capabilities
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Capability Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {capabilities.map(capability => (
              <TableRow key={capability.id}>
                <TableCell>{capability.capability_description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Capability Button */}
      <Button variant="contained" color="primary" onClick={handleOpenCapabilityDialog} style={{ marginTop: '20px' }}>
        Add Required Capability
      </Button>

      {/* Add Capability Dialog */}
      <Dialog open={openCapabilityDialog} onClose={handleCloseCapabilityDialog}>
        <DialogTitle>Add Required Capability</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Capability Description"
            fullWidth
            value={newCapability}
            onChange={handleCapabilityInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCapabilityDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddCapability} color="primary">
            Add Capability
          </Button>
        </DialogActions>
      </Dialog>

      {/* Use Cases Section */}
      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
        Use Cases
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Use Case Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {useCases.map(useCase => (
              <TableRow key={useCase.id}>
                <TableCell>{useCase.use_case_description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Use Case Button */}
      <Button variant="contained" color="primary" onClick={handleOpenUseCaseDialog} style={{ marginTop: '20px' }}>
        Add Use Case
      </Button>

      {/* Add Use Case Dialog */}
      <Dialog open={openUseCaseDialog} onClose={handleCloseUseCaseDialog}>
        <DialogTitle>Add Use Case</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Use Case Description"
            fullWidth
            value={newUseCase}
            onChange={handleUseCaseInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUseCaseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddUseCase} color="primary">
            Add Use Case
          </Button>
        </DialogActions>
      </Dialog>
      {/* Back Button */}
      <Grid container justifyContent="flex-start" style={{ marginTop: '20px' }}>
        <Grid item>
          <Button variant="outlined" onClick={onBackToTable}>Back to Table</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default POCDetail;
