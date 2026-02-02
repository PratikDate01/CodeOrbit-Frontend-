import React from 'react';
import { Box, Container, Typography, Paper, Divider, Alert } from '@mui/material';
import { Info } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>Refund & Cancellation</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Last Updated: February 2, 2026</Typography>
          
          <Divider sx={{ mb: 4 }} />

          <Alert icon={<Info size={20} />} severity="info" sx={{ mb: 4, borderRadius: 2 }}>
            At CodeOrbit, we strive to provide the best learning experience. Please read our refund policy carefully before making any payments.
          </Alert>

          <Typography variant="h6" fontWeight={700} gutterBottom>1. Non-Refundable Fees</Typography>
          <Typography variant="body1" paragraph>
            Fees paid for internship programs are generally **non-refundable**. This is because upon payment, we immediately allocate resources, create your portal access, and initiate administrative processing.
          </Typography>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>2. Eligibility for Refund</Typography>
          <Typography variant="body1" paragraph>
            Refunds may only be considered in the following exceptional circumstances:
          </Typography>
          <ul>
            <li><Typography variant="body1">Duplicate payments made due to technical glitches.</Typography></li>
            <li><Typography variant="body1">Cancellation of the internship program by CodeOrbit before the start date.</Typography></li>
          </ul>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>3. Refund Process</Typography>
          <Typography variant="body1" paragraph>
            To request a refund for a duplicate payment, please email us at <strong>support@codeorbit.ai</strong> with your payment receipt and transaction ID within 48 hours of the transaction. Approved refunds will be processed within 7-10 working days to the original payment method.
          </Typography>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>4. Program Cancellation</Typography>
          <Typography variant="body1" paragraph>
            If CodeOrbit cancels an internship track for any reason, all registered candidates will receive a 100% refund of the fees paid for that specific track.
          </Typography>

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4 }}>5. No-Show Policy</Typography>
          <Typography variant="body1" paragraph>
            If a candidate fails to join or participate in the internship after payment, no refund or credit will be provided.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default RefundPolicy;
