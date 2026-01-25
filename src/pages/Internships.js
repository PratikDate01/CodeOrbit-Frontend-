import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Grid, Card, CardContent, Paper, Chip, MenuItem, Stepper, Step, StepLabel, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress } from '@mui/material';
import API from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CodeIcon from '@mui/icons-material/Code';
import CloudIcon from '@mui/icons-material/Cloud';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAuth } from '../context/AuthContext';

const Internships = () => {
  const { userInfo } = useAuth();
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    college: userInfo?.education || '',
    course: '',
    year: '',
    skills: userInfo?.skills?.join(', ') || '',
    experience: '',
    preferredDomain: '',
    duration: 1
  });

  const [myApplications, setMyApplications] = useState([]);
  const [fetchingApps, setFetchingApps] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchMyApplications = useCallback(async () => {
    if (!userInfo) return;
    setFetchingApps(true);
    try {
      const { data } = await API.get('/internships/my-applications');
      setMyApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setFetchingApps(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone || '',
        college: userInfo.education || '',
        skills: userInfo.skills?.join(', ') || ''
      }));
      fetchMyApplications();
    }
  }, [userInfo, fetchMyApplications]);

  const programs = [
    { title: 'Web Development', icon: <CodeIcon />, durationInfo: '8-12 Weeks', skills: ['React', 'Node.js', 'JS'] },
    { title: 'Data Science', icon: <DataObjectIcon />, durationInfo: '10-12 Weeks', skills: ['Python', 'ML', 'SQL'] },
    { title: 'Cloud Computing', icon: <CloudIcon />, durationInfo: '8-10 Weeks', skills: ['AWS', 'Docker', 'K8s'] },
    { title: 'UI/UX Design', icon: <DesignServicesIcon />, durationInfo: '6-8 Weeks', skills: ['Figma', 'UX Research'] }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) return;
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Submit Application directly
      await API.post('/internships/apply', { 
        preferredDomain: formData.preferredDomain,
        duration: formData.duration,
        formData: { ...formData }
      });

      setMessage('Application Successful! Welcome to the program.');
      fetchMyApplications();
      setFormData(prev => ({ 
        ...prev, 
        course: '', 
        year: '', 
        skills: '', 
        experience: '',
        preferredDomain: '',
        duration: 1
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Error processing application.');
    } finally {
      setLoading(false);
    }
  };

  const selectionProcess = [
    { label: 'Register/Login', description: 'Mandatory to have an account to apply.' },
    { label: 'Application', description: 'Submit profile, domain, and duration.' },
    { label: 'Verification', description: 'Our team verifies credentials and profile.' },
    { label: 'Onboarding', description: 'Welcome to the Orbit team!' }
  ];

  const benefits = [
    { title: 'Real-world Projects', description: 'Work on actual industry-grade applications.', icon: <WorkOutlineIcon /> },
    { title: 'Mentorship', description: 'Learn directly from experienced developers.', icon: <CheckCircleOutlineIcon /> },
    { title: 'Certifications', description: 'Industry-recognized internship certificate.', icon: <AssignmentTurnedInIcon /> },
    { title: 'Career Guidance', description: 'Help with resumes and interview prep.', icon: <EmojiEventsIcon /> }
  ];

  const faqs = [
    { q: 'Is there any fee for the internship?', a: 'Currently, our internship programs are application-based and focused on providing quality mentorship and real-world project experience.' },
    { q: 'How long does the verification take?', a: 'Our team typically reviews applications within 3-5 business days.' },
    { q: 'Can I apply for multiple domains?', a: 'We recommend focusing on one domain at a time to ensure the best learning experience.' }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 50%, #000000 100%)',
          color: 'white',
          py: { xs: 10, md: 16 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 48, mb: 3, color: 'rgba(255, 255, 255, 0.6)' }} />
            <Typography variant="h1" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '4rem' } }}>
              Internship Programs
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 400, color: 'rgba(255, 255, 255, 0.8)', maxWidth: 800, mx: 'auto' }}>
              Launch your technology career with hands-on training and industry mentorship.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* My Applications System */}
        {userInfo && (
          <Box sx={{ mb: 10 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
              Track Your Applications
            </Typography>
            {fetchingApps ? (
              <LinearProgress sx={{ borderRadius: 2 }} />
            ) : myApplications.length > 0 ? (
              <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Domain</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Applied Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Application Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myApplications.map((app) => (
                      <TableRow key={app._id} hover>
                        <TableCell>{app.preferredDomain}</TableCell>
                        <TableCell>{app.duration} Months</TableCell>
                        <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={app.status} 
                            color={
                              app.status === 'Selected' ? 'success' : 
                              app.status === 'Rejected' ? 'error' : 
                              app.status === 'New' ? 'info' : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                You haven't applied for any internships yet. Check out our programs below!
              </Alert>
            )}
          </Box>
        )}

        {/* Programs Grid */}
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>Featured Programs</Typography>
        <Grid container spacing={4} sx={{ mb: 12 }}>
          {programs.map((program, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index} sx={{ display: 'flex' }}>
              <Card sx={{ 
                height: '100%', 
                width: '100%',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)' },
                borderRadius: 4
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ color: 'secondary.main', mb: 2 }}>
                    {React.cloneElement(program.icon, { sx: { fontSize: 48 } })}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={700}>{program.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">{program.durationInfo}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                    {program.skills.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Benefits Section */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>Why Intern With Us?</Typography>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    {benefit.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>{benefit.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{benefit.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Selection Process Section */}
        <Box sx={{ mb: 12, py: 8, px: 4, bgcolor: 'action.hover', borderRadius: 6 }}>
          <Typography variant="h2" sx={{ mb: 8, textAlign: 'center' }}>Selection Process</Typography>
          <Stepper alternativeLabel sx={{ mb: 4 }}>
            {selectionProcess.map((step) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="subtitle1" fontWeight={600}>{step.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{step.description}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Application Form */}
        <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 8, border: '1px solid', borderColor: 'divider', mb: 12 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" gutterBottom>Apply Now</Typography>
            <Typography variant="body1" color="text.secondary">Ready to start? Fill out the application below.</Typography>
          </Box>


          {message && <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            {loading && <LoadingSpinner />}
            <Grid container spacing={4}>
              {/* Personal Details Group */}
              <Grid size={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>1. Personal Information</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} required variant="outlined" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                  </Grid>
                </Grid>
              </Grid>

              {/* Professional Details Group */}
              <Grid size={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 600, color: 'primary.main' }}>2. Academic & Interest Details</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth select label="Preferred Internship Domain" name="preferredDomain" value={formData.preferredDomain} onChange={handleChange} required>
                      {programs.map((p) => <MenuItem key={p.title} value={p.title}>{p.title}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth select label="Duration" name="duration" value={formData.duration} onChange={handleChange} required>
                      {[1, 2, 3, 6].map((m) => <MenuItem key={m} value={m}>{m} Month{m > 1 ? 's' : ''}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="College/University Name" name="college" value={formData.college} onChange={handleChange} required />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="Course/Degree (e.g. B.Tech CSE)" name="course" value={formData.course} onChange={handleChange} required />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="Year of Study" name="year" value={formData.year} onChange={handleChange} required />
                  </Grid>
                  <Grid size={12}>
                    <TextField 
                      fullWidth 
                      multiline 
                      rows={4} 
                      label="Key Skills & Brief Experience" 
                      name="skills" 
                      value={formData.skills} 
                      onChange={handleChange} 
                      placeholder="List your technical skills (e.g. JavaScript, Python) and any previous projects or internships..."
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={12} sx={{ textAlign: 'center', mt: 4 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  type="submit" 
                  disabled={loading}
                  sx={{ 
                    px: 10, 
                    py: 2, 
                    borderRadius: 4,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    fontWeight: 700,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }}
                >
                  {loading ? 'Submitting...' : 'Apply Now'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* FAQ Section */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 700 }}>Frequently Asked Questions</Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Internships;
