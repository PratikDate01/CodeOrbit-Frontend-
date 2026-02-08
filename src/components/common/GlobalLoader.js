import React from 'react';
import { Backdrop, CircularProgress, Typography, Box, Paper } from '@mui/material';
import { useLoader } from '../../context/LoaderContext';

const GlobalLoader = () => {
  const { loading, message } = useLoader();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 999,
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={loading}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'transparent',
          color: 'white',
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
          <CircularProgress
            variant="determinate"
            sx={{
              color: (theme) => theme.palette.grey[800],
            }}
            size={60}
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
            size={60}
            thickness={4}
          />
        </Box>
        {message && (
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontWeight: 600,
              letterSpacing: '0.5px',
              textAlign: 'center',
              animation: 'pulse 2s infinite ease-in-out',
              '@keyframes pulse': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.6 },
              },
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Backdrop>
  );
};

export default GlobalLoader;
