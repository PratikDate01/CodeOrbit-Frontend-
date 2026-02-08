import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert, Grid, Card, CardContent, Paper, Chip, MenuItem, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress } from '@mui/material';
import API from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Internships = () => {
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
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
    duration: 1,
    amount: 399
  });

  const [myApplications, setMyApplications] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [fetchingApps, setFetchingApps] = useState(false);
  const [fetchingPrograms, setFetchingPrograms] = useState(true);
  const [loading, setLoading] = useState(false);

  const durationPlans = [
    { 
      months: 1, 
      price: 399, 
      label: 'Internship Only',
      ideal: 'Beginners, Students exploring a domain, First-time interns',
      what: 'Learn core fundamentals of the selected domain, Study provided learning materials, Complete assigned tasks and exercises, Attempt knowledge assessment tests',
      projectLevel: 'Mini project (basic implementation)',
      outcome: 'Clear understanding of fundamentals, Practical exposure, Internship certification',
      facilities: [
        'Internship Offer Letter',
        'Structured Learning Materials (PDFs / Docs / Resources)',
        'Task Assignments',
        'Online Tests & Evaluations',
        'Mini Project',
        'Internship Completion Certificate',
        'Email / WhatsApp Support for queries'
      ]
    },
    { 
      months: 3, 
      price: 599, 
      label: 'Internship + Training',
      ideal: 'Intermediate learners, Students wanting hands-on experience, Portfolio building',
      what: 'Study advanced concepts through provided materials, Work on structured tasks and case-based assignments, Complete regular evaluations and tests, Develop a real-world project',
      projectLevel: 'Functional real-world project',
      outcome: 'Strong practical skills, Industry-oriented project, Improved employability',
      facilities: [
        'Internship Offer Letter',
        'Detailed Learning Resources',
        'Task-based Learning Path',
        'Regular Tests & Performance Evaluation',
        'Major Project (Individual / Team)',
        'Internship Completion Certificate',
        'Letter of Recommendation (Performance-Based)',
        'Resume Project Guidance'
      ]
    },
    { 
      months: 6, 
      price: 999, 
      label: 'Internship + Training + Placement Prep',
      ideal: 'Final-year students, Long-term industrial training seekers, Career-focused learners',
      what: 'Follow a complete industry-level learning roadmap, Work on complex assignments & evaluations, Develop production-level project(s), Complete documentation & internship reports, Undergo final assessments',
      projectLevel: 'Industry / production-level project',
      outcome: 'Real industrial exposure, Job-ready skills, Strong resume & experience proof',
      facilities: [
        'Internship Offer Letter',
        'Experience Certificate',
        'Comprehensive Learning Material',
        'Advanced Tasks & Assessments',
        'Production-Level Project',
        'Internship Report & Documentation Support',
        'Letter of Recommendation (Performance-Based)',
        'Placement Readiness Guidance'
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'duration') {
      const plan = durationPlans.find(p => p.months === parseInt(value));
      setFormData({ 
        ...formData, 
        duration: parseInt(value), 
        amount: plan ? plan.price : 0 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  const fetchPrograms = async () => {
    setFetchingPrograms(true);
    try {
      const { data } = await API.get('/internships/programs');
      setPrograms(data);
    } catch (err) {
      console.error('Error fetching programs:', err);
    } finally {
      setFetchingPrograms(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) return;
    
    try {
      // Submit Application directly
      await API.post('/internships/apply', { 
        preferredDomain: formData.preferredDomain,
        duration: formData.duration,
        amount: formData.amount,
        formData: { ...formData }
      }, {
        loaderMessage: 'Submitting your application...'
      });

      showNotification('Application Successful! Welcome to the program.', 'success');
      fetchMyApplications();
      setFormData(prev => ({ 
        ...prev, 
        course: '', 
        year: '', 
        skills: '', 
        experience: '',
        preferredDomain: '',
        duration: 1,
        amount: 399
      }));
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error processing application.', 'error');
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
    { q: 'Is there any fee for the internship?', a: 'Selection for our programs is free. A nominal Program Contribution Fee is charged for some tracks to cover training resources, certification infrastructure, and administrative costs. See our Fee Transparency section for details.' },
    { q: 'How long does the verification take?', a: 'Our team typically reviews applications within 3-5 business days.' },
    { q: 'Are the certificates verifiable?', a: 'Yes, every certificate comes with a unique Verification ID and QR code that can be verified on our public portal.' },
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

        {/* Programs Grid */}
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>Featured Programs</Typography>
        
        {fetchingPrograms ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
            <LoadingSpinner />
          </Box>
        ) : programs.length > 0 ? (
          <Grid container spacing={4} sx={{ mb: 12 }}>
            {programs.map((program, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index} sx={{ display: 'flex' }}>
                <Card sx={{ 
                  height: '100%', 
                  width: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-8px)' },
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {program.thumbnail && (
                    <Box 
                      component="img"
                      src={program.thumbnail}
                      alt={program.title}
                      sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ p: 3, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom fontWeight={700}>{program.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {program.description?.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                      <AccessTimeIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">{program.duration || program.durationInfo || '8 Weeks'}</Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => {
                        setFormData(prev => ({ ...prev, preferredDomain: program.title }));
                        document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
                      }}
                      sx={{ borderRadius: 2, mt: 'auto' }}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info" sx={{ mb: 12, borderRadius: 2 }}>
            New programs are launching soon. Stay tuned!
          </Alert>
        )}

        {/* Selection Process Section */}
        <div className="mb-12 py-10 px-6 bg-gray-50/50 rounded-[2.5rem] overflow-hidden border border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-12 text-center text-gray-900">
            Selection Process
          </h2>
          <div className="flex flex-col sm:flex-row justify-between items-start relative w-full max-w-full">
            {selectionProcess.map((step, index) => (
              <div key={step.label} className="flex flex-col items-center text-center relative z-10 w-full sm:flex-1 mb-10 sm:mb-0">
                {/* Horizontal Connector Line (Desktop Only) */}
                {index < selectionProcess.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[50%] w-full h-0.5 bg-gray-200 -z-10"></div>
                )}
                
                {/* Step Circle */}
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-5 shadow-lg shadow-blue-200 text-lg">
                  {index + 1}
                </div>
                
                {/* Step Content */}
                <div className="px-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2">
                    {step.label}
                  </h3>
                  <p className="text-sm text-gray-600 max-w-[180px] mx-auto leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <Paper id="application-form" elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 8, border: '1px solid', borderColor: 'divider', mb: 12 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" gutterBottom>Apply Now</Typography>
            <Typography variant="body1" color="text.secondary">Ready to start? Fill out the application below.</Typography>
          </Box>




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
                    <TextField 
                      fullWidth 
                      select 
                      label="Duration & Pricing" 
                      name="duration" 
                      value={formData.duration} 
                      onChange={handleChange} 
                      required
                      helperText="Select a plan to see its benefits"
                    >
                      {durationPlans.map((p) => (
                        <MenuItem key={p.months} value={p.months}>
                          {p.months} Month{p.months > 1 ? 's' : ''} - ₹{p.price}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Plan Details Display */}
                  <Grid size={12}>
                    {formData.duration && (
                      <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: 'action.hover' }}>
                        <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 700 }}>
                          {durationPlans.find(p => p.months === formData.duration)?.label}
                        </Typography>
                        
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" fontWeight={700}>🎯 Ideal For:</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {durationPlans.find(p => p.months === formData.duration)?.ideal}
                            </Typography>
                            
                            <Typography variant="subtitle2" fontWeight={700}>🧠 What You'll Do:</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {durationPlans.find(p => p.months === formData.duration)?.what}
                            </Typography>

                            <Typography variant="subtitle2" fontWeight={700}>📂 Project Level:</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {durationPlans.find(p => p.months === formData.duration)?.projectLevel}
                            </Typography>

                            <Typography variant="subtitle2" fontWeight={700}>🏁 Outcome:</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {durationPlans.find(p => p.months === formData.duration)?.outcome}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" fontWeight={700}>🛠️ Facilities Provided:</Typography>
                            <Box sx={{ mt: 1 }}>
                              {durationPlans.find(p => p.months === formData.duration)?.facilities.map((f, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                  <Typography variant="caption" color="text.secondary">{f}</Typography>
                                </Box>
                              ))}
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    )}
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

        {/* Fee Transparency Section */}
        <Box sx={{ mb: 12, p: { xs: 4, md: 6 }, bgcolor: 'background.alt', borderRadius: 8, border: '1px solid', borderColor: 'divider' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight={800} gutterBottom>Fee Transparency</Typography>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: 'text.primary' }}>
                We believe in complete honesty. Selection for all CodeOrbit internships is <strong>100% Free</strong>.
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                The Program Contribution Fee (starting at ₹399) is only charged after selection to cover the costs of training resources, cloud infrastructure, verifiable certification, and lifetime credential maintenance.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/fee-structure"
                sx={{ 
                  px: 4,
                  borderRadius: 3
                }}
              >
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Box>

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
