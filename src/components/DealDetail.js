import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress, Drawer, Box, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import DealDetailHeader from './DealDetailHeader'; // Import the header component
import DealStakeholders from './DealStakeholders'; // Import the new component


const drawerWidth = 400;

const DealDetail = ({ token, deal }) => {
    const { id } = useParams(); // Get the deal ID from the URL
    const selectedDeal = deal; // Deal passed from the DealDetailWrapper in App.js

    const [milestones, setMilestones] = useState([]); // State to store milestones
    const [notes, setNotes] = useState([]); // State to store notes
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(''); // State to store current status
    const [drawerOpen, setDrawerOpen] = useState(false); // State to control the sidebar
    const [editorContent, setEditorContent] = useState(''); // State to store Quill content
    const [noteTitle, setNoteTitle] = useState(''); // State to store note title
    const [editingNote, setEditingNote] = useState(null); // Track if editing an existing note

    // Fetch the milestones, notes, and current status for the deal
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch milestones
                const milestoneResponse = await axios.get(`http://localhost:5001/deals/${id}/milestones`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMilestones(milestoneResponse.data);

                // Fetch notes
                const notesResponse = await axios.get(`http://localhost:5001/deals/${id}/notes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotes(notesResponse.data);

                // Fetch current deal status
                const statusResponse = await axios.get(`http://localhost:5001/deals/${id}/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentStatus(statusResponse.data.current_stage);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, token]);

    // Open sidebar (drawer) for creating or editing notes
    const handleOpenDrawer = (note = null) => {
        if (note) {
            setEditorContent(note.content); // Load existing content for editing
            setNoteTitle(note.title || ''); // Load existing title or leave blank
            setEditingNote(note); // Set the note being edited
        } else {
            setEditorContent(''); // Clear the editor for a new note
            setNoteTitle(''); // Clear the title for a new note
            setEditingNote(null); // Set to null for creating a new note
        }
        setDrawerOpen(true); // Open the sidebar
    };

    // Close sidebar (drawer)
    const handleCloseDrawer = () => {
        setDrawerOpen(false); // Close the sidebar
        setEditorContent(''); // Clear the editor content
        setNoteTitle(''); // Clear the title
        setEditingNote(null); // Reset editing state
    };

    // Save or update note
    const handleSaveNote = async () => {
        try {
            const finalTitle = noteTitle.trim() || 'Untitled Note'; // Default title if user doesn't provide one

            if (editingNote) {
                // Update existing note
                await axios.put(`http://localhost:5001/notes/${editingNote.id}`, {
                    content: editorContent,
                    title: finalTitle
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Create new note
                await axios.post(`http://localhost:5001/deals/${id}/notes`, {
                    content: editorContent,
                    title: finalTitle,
                    isShared: false // Default is not shared
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // Refresh the notes list
            const notesResponse = await axios.get(`http://localhost:5001/deals/${id}/notes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(notesResponse.data);
            handleCloseDrawer(); // Close the drawer after saving
        } catch (err) {
            console.error('Error saving note:', err);
        }
    };

    if (!selectedDeal) {
        return <Typography variant="h6">Deal not found.</Typography>;
    }

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="body1" color="error">Error: {error}</Typography>;
    }

    return (
        <div style={{ paddingTop: 0 }}>
            {/* Use the DealDetailHeader to display deal details */}
            <DealDetailHeader deal={selectedDeal} currentStatus={currentStatus} />

            {/* Deal Stakeholders */}
            <DealStakeholders dealId={id} token={token} /> {/* Add the stakeholders component */}

            {/* Milestones Table */}
            <Typography variant="h5" style={{ marginTop: '20px' }}>Milestones</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Milestone Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {milestones.map((milestone) => (
                        <TableRow key={milestone.id}>
                            <TableCell>{milestone.milestone_name}</TableCell>
                            <TableCell>{milestone.description}</TableCell>
                            <TableCell>{new Date(milestone.due_date).toLocaleDateString()}</TableCell>
                            <TableCell>{milestone.status}</TableCell>
                            <TableCell>{new Date(milestone.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(milestone.updated_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Notes Section */}
            <Typography variant="h5" style={{ marginTop: '20px' }}>Notes</Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDrawer()} style={{ marginBottom: '20px' }}>
                Create Note
            </Button>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Note ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {notes.map((note) => (
                        <TableRow key={note.id} hover onClick={() => handleOpenDrawer(note)} style={{ cursor: 'pointer' }}>
                            <TableCell>{note.id}</TableCell>
                            <TableCell>{note.title || 'Untitled Note'}</TableCell>
                            <TableCell>{new Date(note.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Sidebar (Drawer) for Quill Editor */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleCloseDrawer}
                PaperProps={{
                    sx: {
                        width: drawerWidth,
                        padding: 2,
                    },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>{editingNote ? 'Edit Note' : 'Create Note'}</Typography>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <ReactQuill value={editorContent} onChange={setEditorContent} style={{ flex: 1 }} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveNote}
                        style={{ marginTop: '20px', alignSelf: 'center' }}
                    >
                        {editingNote ? 'Save Changes' : 'Create Note'}
                    </Button>
                </Box>
            </Drawer>
        </div>
    );
};

export default DealDetail;
