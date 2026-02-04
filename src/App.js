import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages for better initial load performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Internships = lazy(() => import('./pages/Internships'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const VerifySearch = lazy(() => import('./pages/VerifySearch'));
const VerifyDocument = lazy(() => import('./pages/VerifyDocument'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const FeeExplanation = lazy(() => import('./pages/FeeExplanation'));
const Colleges = lazy(() => import('./pages/Colleges'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const InternshipActivity = lazy(() => import('./pages/InternshipActivity'));
const MyLearning = lazy(() => import('./pages/lms/MyLearning'));
const CoursePlayer = lazy(() => import('./pages/lms/CoursePlayer'));

// Loading component for Suspense
const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress />
  </Box>
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f0f0f', // Deep charcoal - professional and sophisticated
      light: '#1f1f1f',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4b5563', // Warm gray - balanced and modern
      light: '#6b7280',
      dark: '#374151',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#d97706', // Warm amber - energetic for CTAs
      light: '#f59e0b',
      dark: '#b45309',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Clean light gray
      paper: '#ffffff',
      alt: '#f1f5f9', // Subtle alternative background
    },
    text: {
      primary: '#1e293b', // Dark slate for excellent readability
      secondary: '#64748b', // Medium gray for secondary text
      muted: '#94a3b8', // Light gray for muted text
    },
    divider: '#e2e8f0',
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 800, letterSpacing: '-0.025em' },
    h3: { fontWeight: 700, letterSpacing: '-0.025em' },
    h4: { fontWeight: 700, letterSpacing: '-0.025em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { lineHeight: 1.6 },
    body1: { lineHeight: 1.7 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(30, 41, 59, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0f0f0f',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#000000',
          },
        },
        containedSecondary: {
          backgroundColor: '#475569',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#334155',
          },
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: '#475569',
          '&:hover': {
            backgroundColor: '#f8fafc',
            borderColor: '#cbd5e1',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: '#ffffff',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            transform: 'translateY(-4px)',
            borderColor: '#cbd5e1',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          color: '#1e293b',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0d4f3c',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: '#475569',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <AuthProvider>
          <CssBaseline />
          <Router>
            <Header />
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/internships" element={<Internships />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify" element={<VerifySearch />} />
                  <Route path="/verify/:id" element={<VerifyDocument />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/refund" element={<RefundPolicy />} />
                  <Route path="/fee-structure" element={<FeeExplanation />} />
                  <Route path="/colleges" element={<Colleges />} />
                  <Route 
                    path="/dashboard/*" 
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/internship-activity/:internshipId" 
                    element={
                      <PrivateRoute>
                        <InternshipActivity />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/my-learning" 
                    element={
                      <PrivateRoute>
                        <MyLearning />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/learning/:programId" 
                    element={
                      <PrivateRoute>
                        <CoursePlayer />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/admin/*" 
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } 
                  />
                </Routes>
              </Suspense>
            </ErrorBoundary>
            <Footer />
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
