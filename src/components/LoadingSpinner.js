import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ size = 40, color = 'primary' }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ my: 2 }}>
      <CircularProgress size={size} color={color} />
    </Box>
  );
};

export default LoadingSpinner;
