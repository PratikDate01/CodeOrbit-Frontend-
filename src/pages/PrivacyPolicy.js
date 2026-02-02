import React from 'react';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>Privacy Policy</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Last Updated: February 2, 2026</Typography>
          
          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" fontWeight={700} gutterBottom>1. Introduction</Typography>
          <Typography variant="body1" paragraph>
            Welcome to CodeOrbit. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
          </Typography>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>2. Data We Collect</Typography>
          <Typography variant="body1" paragraph>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </Typography>
          <ul>
            <li><Typography variant="body1"><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</Typography></li>
            <li><Typography variant="body1"><strong>Contact Data:</strong> includes email address and telephone numbers.</Typography></li>
            <li><Typography variant="body1"><strong>Educational Data:</strong> includes college name, degree, and graduation year for internship applications.</Typography></li>
            <li><Typography variant="body1"><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</Typography></li>
          </ul>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>3. How We Use Your Data</Typography>
          <Typography variant="body1" paragraph>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </Typography>
          <ul>
            <li><Typography variant="body1">To process your internship application.</Typography></li>
            <li><Typography variant="body1">To issue certificates and offer letters.</Typography></li>
            <li><Typography variant="body1">To manage our relationship with you.</Typography></li>
            <li><Typography variant="body1">To improve our website, products/services, marketing, customer relationships and experiences.</Typography></li>
          </ul>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>4. Data Security</Typography>
          <Typography variant="body1" paragraph>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
          </Typography>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>5. Contact Us</Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            Email: privacy@codeorbit.ai
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
