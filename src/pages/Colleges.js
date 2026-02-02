import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Stack,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import { 
  School, 
  Users, 
  BarChart, 
  ShieldCheck, 
  ArrowRight,
  Mail,
  Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Colleges = () => {
  const offerings = [
    {
      icon: <Users size={32} />,
      title: 'Bulk Internship Access',
      description: 'Onboard entire batches of students into industry-aligned internship programs with ease.'
    },
    {
      icon: <BarChart size={32} />,
      title: 'Admin Dashboard',
      description: 'Get a dedicated dashboard to track student progress, attendance, and performance in real-time.'
    },
    {
      icon: <ShieldCheck size={32} />,
      title: 'Verified Reports',
      description: 'Download authenticated internship completion reports and performance metrics for your records.'
    },
    {
      icon: <School size={32} />,
      title: 'Curriculum Integration',
      description: 'Our tasks can be mapped to your academic requirements for industrial training credits.'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
          py: { xs: 12, md: 20 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 4 }}>
            <Handshake size={32} />
          </Avatar>
          <Typography variant="h1" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '4rem' } }}>
            CodeOrbit for Institutions
          </Typography>
          <Typography variant="h5" sx={{ mb: 6, fontWeight: 400, opacity: 0.9 }}>
            Partner with us to provide your students with industry-standard internship experiences and simplified administrative tracking.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            endIcon={<ArrowRight size={20} />}
            component={Link}
            to="/contact"
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
          >
            Become a Partner
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={4} sx={{ mb: 12 }}>
          {offerings.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ color: 'primary.main', mb: 3 }}>{item.icon}</Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{item.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: { xs: 4, md: 8 }, borderRadius: 6, bgcolor: 'background.alt', overflow: 'hidden', position: 'relative' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" fontWeight={800} gutterBottom>Why Partner with CodeOrbit?</Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                We bridge the gap between academic theory and industry practice. Our platform provides a transparent, accountable, and high-quality internship ecosystem that benefits both students and institutions.
              </Typography>
              <Stack spacing={2}>
                {[
                  'Centralized tracking for all student internships',
                  'Performance-based evaluation and grading',
                  'Direct industry exposure for students',
                  'Support for AICTE/MSME compliance requirements'
                ].map((text, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ShieldCheck size={20} className="text-blue-600" />
                    <Typography variant="body1" fontWeight={500}>{text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 4, bgcolor: 'primary.main', color: 'white' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Mail size={48} style={{ margin: '0 auto 24px' }} />
                  <Typography variant="h5" fontWeight={700} gutterBottom>Contact our Partnerships Team</Typography>
                  <Typography variant="body2" sx={{ mb: 4, opacity: 0.9 }}>
                    Get a personalized demo of our institutional dashboard and bulk onboarding process.
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>partners@codeorbit.ai</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Colleges;
