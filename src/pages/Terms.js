import React from 'react';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';

const Terms = () => {
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>Terms & Conditions</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Last Updated: February 2, 2026</Typography>
          
          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" fontWeight={700} gutterBottom>1. Agreement to Terms</Typography>
          <Typography variant="body1" paragraph>
            By accessing or using CodeOrbit's platform and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
          </Typography>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>2. Internship Program</Typography>
          <Typography variant="body1" paragraph>
            CodeOrbit provides virtual internship programs for educational purposes. Admission to these programs is based on selection criteria defined by CodeOrbit.
          </Typography>
          <ul>
            <li><Typography variant="body1">Interns are expected to complete tasks within the specified timeline.</Typography></li>
            <li><Typography variant="body1">Certificates are only issued upon successful completion of all required tasks and payment of relevant fees (if applicable).</Typography></li>
            <li><Typography variant="body1">Misconduct or plagiarism will lead to immediate termination from the program without a refund.</Typography></li>
          </ul>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>3. Fees and Payments</Typography>
          <Typography variant="body1" paragraph>
            Certain internship tracks may require a fee for training resources, administrative processing, and certification infrastructure. All fees are clearly mentioned before the final application step.
          </Typography>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>4. Intellectual Property</Typography>
          <Typography variant="body1" paragraph>
            All content provided during the internship, including training materials and project skeletons, are the property of CodeOrbit. Interns retain ownership of the original code they write during the internship but grant CodeOrbit a license to use it for evaluation and showcase purposes.
          </Typography>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>5. Limitation of Liability</Typography>
          <Typography variant="body1" paragraph>
            CodeOrbit shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
          </Typography>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>6. Changes to Terms</Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify or replace these terms at any time. We will provide notice of any significant changes by posting the new terms on this page.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Terms;
