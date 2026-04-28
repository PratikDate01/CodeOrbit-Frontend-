import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Box, Grid,
  MenuItem, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, Stack
} from '@mui/material';
import API from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
    amount: 999
  });

  const [myApplications, setMyApplications] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [fetchingApps, setFetchingApps] = useState(false);
  const [fetchingPrograms, setFetchingPrograms] = useState(true);

  const durationPlans = [
    {
      months: 1,
      price: 999,
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
      price: 1499,
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
      price: 3999,
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
      setFormData({ ...formData, duration: parseInt(value), amount: plan ? plan.price : 0 });
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
    if (!userInfo) {
      showNotification('Please login to apply for internships.', 'error');
      return;
    }
    const { name, email, phone, course, year, skills, preferredDomain } = formData;
    if (!name || !email || !phone || !course || !year || !skills || !preferredDomain) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    try {
      await API.post('/internships/apply', {
        preferredDomain: formData.preferredDomain,
        duration: formData.duration,
        amount: formData.amount,
        formData: { name, email, phone, college: formData.college, course, year, skills, experience: formData.experience }
      }, { loaderMessage: 'Submitting your application...' });

      showNotification('Application Successful! Welcome to the program.', 'success');
      fetchMyApplications();
      setFormData(prev => ({
        ...prev, course: '', year: '', skills: '', experience: '',
        preferredDomain: '', duration: 1, amount: 999
      }));
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error processing application.', 'error');
    }
  };

  const selectionProcess = [
    { label: 'Register / Login', description: 'Mandatory to have an account to apply.' },
    { label: 'Application', description: 'Submit profile, domain, and duration.' },
    { label: 'Verification', description: 'Our team verifies credentials and profile.' },
    { label: 'Onboarding', description: 'Welcome to the Orbit team!' }
  ];

  const benefits = [
    { title: 'Real-world Projects', description: 'Work on actual industry-grade applications.', icon: <WorkOutlineIcon sx={{ fontSize: 22 }} /> },
    { title: 'Mentorship', description: 'Learn directly from experienced developers.', icon: <CheckCircleOutlineIcon sx={{ fontSize: 22 }} /> },
    { title: 'Certifications', description: 'Industry-recognized internship certificate.', icon: <AssignmentTurnedInIcon sx={{ fontSize: 22 }} /> },
    { title: 'Career Guidance', description: 'Help with resumes and interview prep.', icon: <EmojiEventsIcon sx={{ fontSize: 22 }} /> }
  ];

  const faqs = [
    { q: 'Is there any fee for the internship?', a: 'Selection for our programs is free. A nominal Program Contribution Fee is charged for some tracks to cover training resources, certification infrastructure, and administrative costs. See our Fee Transparency section for details.' },
    { q: 'How long does the verification take?', a: 'Our team typically reviews applications within 3-5 business days.' },
    { q: 'Are the certificates verifiable?', a: 'Yes, every certificate comes with a unique Verification ID and QR code that can be verified on our public portal.' },
    { q: 'Can I apply for multiple domains?', a: 'We recommend focusing on one domain at a time to ensure the best learning experience.' }
  ];

  const selectedPlan = durationPlans.find(p => p.months === formData.duration);

  return (
    <Box sx={{ bgcolor: '#ffffff', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Hero ── */}
      <Box sx={{
        bgcolor: '#f7f7f5',
        pt: { xs: 14, md: 22 },
        pb: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #e8e8e4',
      }}>
        {/* dot grid */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.55, pointerEvents: 'none',
        }} />
        {/* blue blob */}
        <Box sx={{
          position: 'absolute', top: '10%', right: '-5%',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* eyebrow */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: '100px', px: 2, py: 0.5, mb: 4,
          }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#2563eb' }} />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb', letterSpacing: 0.5 }}>
              MSME & AICTE Recognized
            </Typography>
          </Box>

          <Typography variant="h1" sx={{
            fontSize: { xs: '2.75rem', sm: '4rem', md: '5.5rem' },
            fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.0,
            color: '#0a0a0a', mb: 4,
          }}>
            Internship
            <Box component="span" sx={{ color: '#2563eb' }}> Programs</Box>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexDirection: { xs: 'column', md: 'row' }, mt: 2 }}>
            <Typography sx={{
              color: '#3f3f3f', fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              lineHeight: 1.7, maxWidth: 520, flex: 1,
            }}>
              Launch your technology career with hands-on training, real-world projects, and expert industry mentorship.
            </Typography>
            <Stack spacing={2} sx={{ flex: '0 0 auto', pt: { xs: 0, md: 1 } }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#0a0a0a', color: '#fff', px: 3.5, py: 1.6,
                  fontSize: '0.95rem', fontWeight: 600, borderRadius: '10px',
                  letterSpacing: 0.2, boxShadow: 'none',
                  '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
                }}
              >
                Apply Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => document.getElementById('programs-section').scrollIntoView({ behavior: 'smooth' })}
                sx={{
                  borderColor: '#d4d4d0', borderWidth: '1.5px',
                  color: '#3f3f3f', px: 3.5, py: 1.6,
                  fontSize: '0.95rem', fontWeight: 600, borderRadius: '10px',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#0a0a0a', bgcolor: 'transparent', boxShadow: 'none' },
                }}
              >
                View Programs
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>

        {/* ── Track My Applications ── */}
        {userInfo && (
          <Box sx={{ mb: { xs: 12, md: 16 } }}>
            <Box sx={{ mb: 6 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                Your Journey
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' } }}>
                Track Applications
              </Typography>
            </Box>

            {fetchingApps ? (
              <LinearProgress sx={{ borderRadius: 2, bgcolor: '#eff6ff', '& .MuiLinearProgress-bar': { bgcolor: '#2563eb' } }} />
            ) : myApplications.length > 0 ? (
              <Box sx={{ border: '1.5px solid #e8e8e4', borderRadius: '16px', overflow: 'hidden' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f7f7f5' }}>
                        {['Domain', 'Duration', 'Applied Date', 'Status'].map(h => (
                          <TableCell key={h} sx={{ fontWeight: 700, color: '#0a0a0a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1.5px solid #e8e8e4' }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {myApplications.map((app) => (
                        <TableRow key={app._id} sx={{ '&:hover': { bgcolor: '#f7f7f5' }, '&:last-child td': { border: 0 } }}>
                          <TableCell sx={{ color: '#0a0a0a', fontWeight: 500, borderColor: '#e8e8e4' }}>{app.preferredDomain}</TableCell>
                          <TableCell sx={{ color: '#737373', borderColor: '#e8e8e4' }}>{app.duration} Months</TableCell>
                          <TableCell sx={{ color: '#737373', borderColor: '#e8e8e4' }}>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell sx={{ borderColor: '#e8e8e4' }}>
                            <Box sx={{
                              display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.4,
                              borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                              ...(app.status === 'Selected' && { bgcolor: '#dcfce7', color: '#15803d' }),
                              ...(app.status === 'Rejected' && { bgcolor: '#fee2e2', color: '#b91c1c' }),
                              ...(app.status === 'New' && { bgcolor: '#eff6ff', color: '#2563eb' }),
                              ...(!['Selected','Rejected','New'].includes(app.status) && { bgcolor: '#fef9c3', color: '#a16207' }),
                            }}>
                              {app.status}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Box sx={{ p: 4, border: '1.5px solid #e8e8e4', borderRadius: '16px', bgcolor: '#f7f7f5' }}>
                <Typography sx={{ color: '#737373', fontSize: '0.95rem' }}>
                  You haven't applied for any internships yet. Check out our programs below!
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* ── Benefits ── */}
        <Box sx={{ mb: { xs: 12, md: 20 } }}>
          <Box sx={{ mb: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                Why Us
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' } }}>
                Why Intern With Us?
              </Typography>
            </Box>
            <Typography sx={{ color: '#737373', fontSize: '1rem', maxWidth: 380, lineHeight: 1.7 }}>
              We bridge the gap between academic learning and industry requirements.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box sx={{
                  p: { xs: 3.5, md: 4 },
                  border: '1.5px solid #e8e8e4',
                  borderRadius: '16px',
                  height: '100%',
                  bgcolor: index === 1 ? '#0a0a0a' : '#fff',
                  transition: 'all 0.2s',
                  '&:hover': index === 1
                    ? { boxShadow: '0 16px 40px rgba(10,10,10,0.18)', transform: 'translateY(-2px)' }
                    : { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)', transform: 'translateY(-2px)' },
                }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: '8px', mb: 3,
                    bgcolor: index === 1 ? 'rgba(255,255,255,0.08)' : '#eff6ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: index === 1 ? '#fff' : '#2563eb',
                  }}>
                    {benefit.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: index === 1 ? '#fff' : '#0a0a0a', mb: 1, letterSpacing: '-0.02em' }}>
                    {benefit.title}
                  </Typography>
                  <Typography sx={{ color: index === 1 ? 'rgba(255,255,255,0.55)' : '#737373', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {benefit.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── Featured Programs ── */}
        <Box id="programs-section" sx={{ mb: { xs: 12, md: 20 } }}>
          <Box sx={{ mb: 8 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
              Explore
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' } }}>
              Featured Programs
            </Typography>
          </Box>

          {fetchingPrograms ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
              <LoadingSpinner />
            </Box>
          ) : programs.length > 0 ? (
            <Grid container spacing={3}>
              {programs.map((program, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Box sx={{
                    border: '1.5px solid #e8e8e4',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#fff',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)', transform: 'translateY(-2px)' },
                  }}>
                    {program.thumbnail && (
                      <Box component="img" src={program.thumbnail} alt={program.title}
                        sx={{ width: '100%', height: 148, objectFit: 'cover' }} />
                    )}
                    <Box sx={{ p: 3.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0a0a0a', mb: 1, letterSpacing: '-0.02em' }}>
                        {program.title}
                      </Typography>
                      <Typography sx={{ color: '#737373', fontSize: '0.875rem', lineHeight: 1.7, mb: 3, flexGrow: 1 }}>
                        {program.description?.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: '#737373' }}>
                        <AccessTimeIcon sx={{ fontSize: 15 }} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{program.duration || program.durationInfo || '8 Weeks'}</Typography>
                      </Box>
                      <Button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, preferredDomain: program.title }));
                          document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
                        }}
                        endIcon={<ArrowForwardIcon sx={{ fontSize: '0.9rem !important' }} />}
                        sx={{
                          alignSelf: 'flex-start', color: '#2563eb', fontWeight: 600,
                          fontSize: '0.875rem', p: 0, minWidth: 0,
                          '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                        }}
                      >
                        Apply Now
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ p: 4, border: '1.5px solid #e8e8e4', borderRadius: '16px', bgcolor: '#f7f7f5' }}>
              <Typography sx={{ color: '#737373' }}>New programs are launching soon. Stay tuned!</Typography>
            </Box>
          )}
        </Box>

        {/* ── Selection Process ── */}
        <Box sx={{
          mb: { xs: 12, md: 20 },
          py: { xs: 8, md: 10 },
          px: { xs: 4, md: 8 },
          bgcolor: '#f7f7f5',
          borderRadius: '24px',
          border: '1px solid #e8e8e4',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* dot grid */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
            backgroundSize: '28px 28px', opacity: 0.4, pointerEvents: 'none', borderRadius: '24px',
          }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ mb: 8 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                How It Works
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' } }}>
                Selection Process
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {selectionProcess.map((step, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Box sx={{
                    p: 3.5, bgcolor: '#fff',
                    border: '1.5px solid #e8e8e4',
                    borderRadius: '16px', height: '100%',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)', transform: 'translateY(-2px)' },
                  }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '8px',
                      bgcolor: '#eff6ff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', mb: 3,
                    }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb' }}>{index + 1}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0a0a0a', mb: 1, letterSpacing: '-0.02em' }}>
                      {step.label}
                    </Typography>
                    <Typography sx={{ color: '#737373', fontSize: '0.9rem', lineHeight: 1.7 }}>
                      {step.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* ── Application Form ── */}
        <Box
          id="application-form"
          sx={{
            mb: { xs: 12, md: 20 },
            p: { xs: 4, md: 8 },
            border: '1.5px solid #e8e8e4',
            borderRadius: '24px',
            bgcolor: '#fff',
          }}
        >
          <Box sx={{ mb: 8 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
              Get Started
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' }, mb: 1.5 }}>
              Apply Now
            </Typography>
            <Typography sx={{ color: '#737373', fontSize: '1rem', lineHeight: 1.7 }}>
              Ready to start your journey? Fill out the application below.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={4}>

              {/* Personal Info */}
              <Grid size={12}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 3 }}>
                  1 — Personal Information
                </Typography>
                <Grid container spacing={3}>
                  {[
                    { label: 'Full Name', name: 'name', type: 'text' },
                    { label: 'Email Address', name: 'email', type: 'email' },
                    { label: 'Phone Number', name: 'phone', type: 'text' },
                  ].map(field => (
                    <Grid size={{ xs: 12, md: 4 }} key={field.name}>
                      <TextField
                        fullWidth label={field.label} name={field.name}
                        type={field.type} value={formData[field.name]}
                        onChange={handleChange} required
                        sx={inputSx}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Academic & Interest */}
              <Grid size={12}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 3, mt: 2 }}>
                  2 — Academic & Interest Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth select label="Preferred Internship Domain"
                      name="preferredDomain" value={formData.preferredDomain}
                      onChange={handleChange} required sx={inputSx}>
                      {programs.map(p => <MenuItem key={p.title} value={p.title}>{p.title}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth select label="Duration & Pricing"
                      name="duration" value={formData.duration}
                      onChange={handleChange} required
                      helperText="Select a plan to see its benefits"
                      sx={inputSx}>
                      {durationPlans.map(p => (
                        <MenuItem key={p.months} value={p.months}>
                          {p.months} Month{p.months > 1 ? 's' : ''} — ₹{p.price}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Plan Details */}
                  {selectedPlan && (
                    <Grid size={12}>
                      <Box sx={{
                        p: { xs: 3, md: 4 },
                        border: '1.5px solid #e8e8e4',
                        borderRadius: '16px',
                        bgcolor: '#f7f7f5',
                      }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0a0a0a', letterSpacing: '-0.03em', mb: 3 }}>
                          {selectedPlan.label}
                        </Typography>
                        <Grid container spacing={4}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            {[
                              { label: 'Ideal For', value: selectedPlan.ideal },
                              { label: "What You'll Do", value: selectedPlan.what },
                              { label: 'Project Level', value: selectedPlan.projectLevel },
                              { label: 'Outcome', value: selectedPlan.outcome },
                            ].map(item => (
                              <Box key={item.label} sx={{ mb: 2.5 }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>
                                  {item.label}
                                </Typography>
                                <Typography sx={{ color: '#3f3f3f', fontSize: '0.9rem', lineHeight: 1.65 }}>
                                  {item.value}
                                </Typography>
                              </Box>
                            ))}
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                              Facilities Provided
                            </Typography>
                            <Stack spacing={1.5}>
                              {selectedPlan.facilities.map((f, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <CheckCircleIcon sx={{ fontSize: 14, color: '#2563eb' }} />
                                  </Box>
                                  <Typography sx={{ fontSize: '0.875rem', color: '#3f3f3f' }}>{f}</Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  )}

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="College / University Name" name="college"
                      value={formData.college} onChange={handleChange} required sx={inputSx} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="Course / Degree (e.g. B.Tech CSE)" name="course"
                      value={formData.course} onChange={handleChange} required sx={inputSx} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="Year of Study" name="year"
                      value={formData.year} onChange={handleChange} required sx={inputSx} />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth multiline rows={4}
                      label="Key Skills & Brief Experience" name="skills"
                      value={formData.skills} onChange={handleChange} required
                      placeholder="List your technical skills (e.g. JavaScript, Python) and any previous projects or internships..."
                      helperText="Please list your technical skills. This is required for application review."
                      sx={inputSx}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={12} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#0a0a0a', color: '#fff',
                    px: 5, py: 1.6,
                    fontSize: '0.95rem', fontWeight: 600,
                    borderRadius: '10px', boxShadow: 'none',
                    '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
                  }}
                >
                  Submit Application
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* ── Fee Transparency ── */}
        <Box sx={{
          mb: { xs: 12, md: 20 },
          p: { xs: 5, md: 8 },
          border: '1.5px solid #e8e8e4',
          borderRadius: '24px',
          bgcolor: '#fff',
        }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                Full Transparency
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 2 }}>
                Fee Transparency
              </Typography>
              <Typography sx={{ color: '#3f3f3f', fontSize: '1rem', lineHeight: 1.75, mb: 1.5 }}>
                We believe in complete honesty. Selection for all CodeOrbit internships is{' '}
                <Box component="span" sx={{ fontWeight: 700, color: '#0a0a0a' }}>100% Free</Box>.
              </Typography>
              <Typography sx={{ color: '#737373', fontSize: '0.95rem', lineHeight: 1.75 }}>
                The Program Contribution Fee (starting at ₹999) is only charged after selection to cover the costs of training resources, cloud infrastructure, verifiable certification, and lifetime credential maintenance.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/fee-structure"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#2563eb', color: '#fff',
                  px: 4, py: 1.6,
                  fontWeight: 600, fontSize: '0.95rem',
                  borderRadius: '10px', boxShadow: 'none',
                  '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 8px 30px rgba(37,99,235,0.35)' },
                  transition: 'all 0.2s',
                }}
              >
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* ── FAQ ── */}
        <Box sx={{ mb: { xs: 10, md: 12 } }}>
          <Box sx={{ mb: 6 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
              Got Questions?
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' } }}>
              Frequently Asked Questions
            </Typography>
          </Box>

          <Stack spacing={1.5}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                elevation={0}
                sx={{
                  border: '1.5px solid #e8e8e4',
                  borderRadius: '12px !important',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { borderColor: '#2563eb' },
                  transition: 'border-color 0.2s',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#2563eb' }} />}
                  sx={{ px: 3, py: 0.5 }}
                >
                  <Typography sx={{ fontWeight: 700, color: '#0a0a0a', fontSize: '0.95rem' }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pt: 0, pb: 3 }}>
                  <Typography sx={{ color: '#737373', fontSize: '0.9rem', lineHeight: 1.75 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>

        {/* ── CTA ── */}
        <Box sx={{
          p: { xs: 6, md: 10 },
          textAlign: 'center',
          bgcolor: '#0a0a0a',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px', pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', top: '-30%', left: '30%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h2" gutterBottom sx={{
              color: '#ffffff', fontWeight: 800,
              letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '3rem' },
            }}>
              Ready to Launch<br />Your Career?
            </Typography>
            <Typography sx={{
              mb: 6, color: 'rgba(255,255,255,0.5)',
              fontSize: '1.1rem', maxWidth: 520, mx: 'auto', lineHeight: 1.7,
            }}>
              Join hundreds of students who have already kick-started their technology careers with CodeOrbit.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained" size="large"
                onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#2563eb', color: '#fff', px: 5, py: 1.6,
                  fontWeight: 600, fontSize: '0.95rem', borderRadius: '10px',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 8px 30px rgba(37,99,235,0.45)' },
                  transition: 'all 0.2s',
                }}
              >
                Apply Now
              </Button>
              <Button
                variant="outlined" size="large"
                component={Link} to="/contact"
                sx={{
                  borderColor: 'rgba(255,255,255,0.18)', borderWidth: '1.5px',
                  color: 'rgba(255,255,255,0.75)', px: 5, py: 1.6,
                  fontWeight: 600, fontSize: '0.95rem', borderRadius: '10px',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                Contact Us
              </Button>
            </Stack>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

// Shared TextField styling to match the page theme
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '& fieldset': { borderColor: '#e8e8e4', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#0a0a0a' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
};

export default Internships;