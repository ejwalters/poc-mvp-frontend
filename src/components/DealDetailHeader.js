import React from 'react';
import { Typography, Grid, Paper, Box, Divider } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Icon for Amount
import BusinessIcon from '@mui/icons-material/Business'; // Icon for Client Name
import EventIcon from '@mui/icons-material/Event'; // Icon for Dates
import TimelineIcon from '@mui/icons-material/Timeline'; // Icon for Status

const DealDetailHeader = ({ deal, currentStatus }) => {
    const { deal_name, client_name, amount, start_date, end_date } = deal;

    return (
        <Paper
            elevation={3}
            sx={{ padding: 3, marginBottom: 3, marginTop: 0 }} // Set marginTop to 0 to move closer to the top
        >
            <Typography variant="h4" gutterBottom>
                {deal_name}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            {/* Grid layout for deal details */}
            <Grid container spacing={2}>
                {/* Client Name */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center">
                        <BusinessIcon sx={{ marginRight: 1 }} />
                        <Typography variant="subtitle1" color="textSecondary">
                            Client Name
                        </Typography>
                    </Box>
                    <Typography variant="h6">{client_name}</Typography>
                </Grid>

                {/* Deal Amount */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center">
                        <AttachMoneyIcon sx={{ marginRight: 1 }} />
                        <Typography variant="subtitle1" color="textSecondary">
                            Deal Amount
                        </Typography>
                    </Box>
                    <Typography variant="h6">${amount.toLocaleString()}</Typography>
                </Grid>

                {/* Deal Status */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center">
                        <TimelineIcon sx={{ marginRight: 1 }} />
                        <Typography variant="subtitle1" color="textSecondary">
                            Current Status
                        </Typography>
                    </Box>
                    <Typography variant="h6">{currentStatus}</Typography>
                </Grid>

                {/* Start Date */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center">
                        <EventIcon sx={{ marginRight: 1 }} />
                        <Typography variant="subtitle1" color="textSecondary">
                            Start Date
                        </Typography>
                    </Box>
                    <Typography variant="h6">
                        {new Date(start_date).toLocaleDateString()}
                    </Typography>
                </Grid>

                {/* End Date */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center">
                        <EventIcon sx={{ marginRight: 1 }} />
                        <Typography variant="subtitle1" color="textSecondary">
                            End Date
                        </Typography>
                    </Box>
                    <Typography variant="h6">
                        {new Date(end_date).toLocaleDateString()}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default DealDetailHeader;
