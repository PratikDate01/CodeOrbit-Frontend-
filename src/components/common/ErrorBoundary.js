import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          sx={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 3
          }}
        >
          <Paper 
            sx={{ 
              p: 5, 
              textAlign: 'center', 
              maxWidth: 500, 
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ color: 'error.main', mb: 2 }}>
              <AlertCircle size={64} />
            </Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>Something went wrong</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<RefreshCw size={18} />}
              onClick={() => window.location.reload()}
              sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 700 }}
            >
              Refresh Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;