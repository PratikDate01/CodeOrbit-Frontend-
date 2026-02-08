import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingSpinner = ({ size = 40, message = '', fullHeight = false }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      sx={{ 
        my: 2,
        minHeight: fullHeight ? '60vh' : 'auto',
        gap: 1.5
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          sx={{ color: (theme) => theme.palette.grey[200] }}
          size={size}
          thickness={4}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: 'primary.main',
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
          }}
          size={size}
          thickness={4}
        />
      </Box>
      {message && (
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
