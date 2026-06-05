import React, { useState, useEffect, useCallback } from 'react';
import {
  PlayCircle, Award, Clock, ArrowLeft, BookOpen,
  ChevronRight, CheckCircle2, Star, GraduationCap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Button, Stack, LinearProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, iconBg, iconColor, value, label }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 2,
    p: 2.5,
    bgcolor: '#fff',
    border: '1.5px solid #e8e8e4',
    borderRadius: '16px',
    minWidth: 160,
    transition: 'all 0.2s',
    '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)' },
  }}>
    <Box sx={{
      width: 44, height: 44, borderRadius: '10px',
      bgcolor: iconBg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: iconColor, flexShrink: 0,
    }}>
      <Icon size={20} />
    </Box>
    <Box>
      <Typography sx={{
        fontWeight: 900, fontSize: '1.4rem', color: '#0a0a0a',
        fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.04em', lineHeight: 1,
      }}>
        {value}
      </Typography>
      <Typography sx={{
        fontSize: '0.68rem', fontWeight: 700, color: '#a3a3a3',
        fontFamily: '"DM Sans", sans-serif',
        textTransform: 'uppercase', letterSpacing: '0.1em', mt: 0.5,
      }}>
        {label}
      </Typography>
    </Box>
  </Box>
);

// ── Component ─────────────────────────────────────────────────────────────────
const MyLearning = () => {
  const { userInfo } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/lms/my-enrollments');
      setEnrollments(data);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError('Failed to load your courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <Box sx={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      minHeight: '80vh', bgcolor: '#f7f7f5', gap: 2,
    }}>
      <Box sx={{
        width: 38, height: 38, borderRadius: '50%',
        border: '2.5px solid #e8e8e4', borderTopColor: '#2563eb',
        animation: 'spin 0.75s linear infinite',
        '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
      }} />
      <Typography sx={{
        color: '#a3a3a3', fontSize: '0.875rem', fontWeight: 500,
        fontFamily: '"DM Sans", sans-serif',
      }}>
        Preparing your workspace…
      </Typography>
    </Box>
  );

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) return (
    <Box sx={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      minHeight: '80vh', bgcolor: '#f7f7f5', px: 3, gap: 3,
    }}>
      <Box
  sx={{
    p: { xs: 4, md: 6 },
    borderRadius: '20px',
    textAlign: 'center',
    maxWidth: 400,
    border: '1.5px solid #fecaca',
    bgcolor: '#fff9f9',
  }}
>
        <Box sx={{
          width: 56, height: 56, borderRadius: '14px',
          bgcolor: '#fee2e2', display: 'flex', alignItems: 'center',
          justifyContent: 'center', mx: 'auto', mb: 3, color: '#b91c1c',
        }}>
          <BookOpen size={26} />
        </Box>
        <Typography sx={{ fontWeight: 800, color: '#0a0a0a', mb: 1, fontFamily: '"DM Sans", sans-serif', fontSize: '1.1rem' }}>
          Something went wrong
        </Typography>
        <Typography sx={{ color: '#737373', fontSize: '0.9rem', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.65 }}>
          {error}
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={fetchEnrollments}
        sx={{
          bgcolor: '#0a0a0a', color: '#fff',
          px: 4, py: 1.5, borderRadius: '10px',
          fontWeight: 700, fontSize: '0.875rem',
          textTransform: 'none', fontFamily: '"DM Sans", sans-serif',
          boxShadow: 'none',
          '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
        }}
      >
        Retry
      </Button>
    </Box>
  );

  // ── Page ────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: '#f7f7f5', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Hero Strip ── */}
      <Box sx={{
        bgcolor: '#f7f7f5',
        pt: { xs: 5, md: 8 },
        pb: { xs: 5, md: 7 },
        borderBottom: '1px solid #e8e8e4',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Dot grid */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.45, pointerEvents: 'none',
        }} />
        {/* Blue blob */}
        <Box sx={{
          position: 'absolute', top: '-20%', right: '-4%',
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 4,
          }}>

            {/* Left — title */}
            <Box>
              {/* Back link */}
              <Button
                component={Link}
                to="/dashboard"
                startIcon={<ArrowLeft size={15} />}
                sx={{
                  mb: 3, color: '#737373', fontWeight: 600, fontSize: '0.825rem',
                  p: 0, minWidth: 0, textTransform: 'none',
                  fontFamily: '"DM Sans", sans-serif',
                  '&:hover': { bgcolor: 'transparent', color: '#0a0a0a' },
                }}
              >
                Back to Dashboard
              </Button>

              {/* Eyebrow */}
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '100px', px: 2, py: 0.4, mb: 2,
              }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563eb' }} />
                <Typography sx={{
                  fontSize: '0.75rem', fontWeight: 600, color: '#2563eb',
                  fontFamily: '"DM Sans", sans-serif', letterSpacing: 0.5,
                }}>
                  Student Workspace
                </Typography>
              </Box>

              <Typography sx={{
                fontWeight: 900, fontSize: { xs: '2rem', md: '3rem' },
                letterSpacing: '-0.05em', color: '#0a0a0a', lineHeight: 1,
                fontFamily: '"DM Sans", sans-serif',
              }}>
                My <Box component="span" sx={{ color: '#2563eb' }}>Learning</Box>
              </Typography>
              <Typography sx={{
                mt: 1.5, color: '#737373', fontSize: '0.95rem', maxWidth: 480,
                fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7,
              }}>
                Track your progress, complete tasks, and earn your certification.
              </Typography>
            </Box>

            {/* Right — stat cards */}
            <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2} flexWrap="wrap">
              <StatCard
                icon={Star}
                iconBg="#fefce8"
                iconColor="#ca8a04"
                value={userInfo?.totalXP || 0}
                label="Total XP Earned"
              />
              <StatCard
                icon={GraduationCap}
                iconBg="#eff6ff"
                iconColor="#2563eb"
                value={enrollments.length}
                label="Active Programs"
              />
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ── Content ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>

        {/* ── Empty State ── */}
        {enrollments.length === 0 ? (
          <Box sx={{
            p: { xs: 8, md: 14 },
            border: '1.5px solid #e8e8e4',
            borderRadius: '24px',
            textAlign: 'center',
            bgcolor: '#fff',
          }}>
            <Box sx={{
              width: 72, height: 72, borderRadius: '18px',
              bgcolor: '#eff6ff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', mx: 'auto', mb: 4, color: '#2563eb',
            }}>
              <BookOpen size={34} />
            </Box>
            <Typography sx={{
              fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' },
              letterSpacing: '-0.04em', color: '#0a0a0a', mb: 1.5,
              fontFamily: '"DM Sans", sans-serif',
            }}>
              Nothing here yet
            </Typography>
            <Typography sx={{
              color: '#737373', fontSize: '0.95rem', lineHeight: 1.75,
              maxWidth: 420, mx: 'auto', mb: 6,
              fontFamily: '"DM Sans", sans-serif',
            }}>
              Your learning journey begins once your internship is approved. Check your application status on the dashboard.
            </Typography>
            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              sx={{
                bgcolor: '#2563eb', color: '#fff',
                px: 5, py: 1.6, fontWeight: 700, fontSize: '0.95rem',
                borderRadius: '10px', boxShadow: 'none', textTransform: 'none',
                fontFamily: '"DM Sans", sans-serif',
                '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 8px 30px rgba(37,99,235,0.3)' },
                transition: 'all 0.2s',
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {enrollments.map((enrollment) => {
              const pct = enrollment.progress || 0;
              const isComplete = enrollment.status === 'Completed';

              return (
                <Grid size={{ xs: 12, lg: 6 }} key={enrollment._id}>
                  <Box sx={{
                    bgcolor: '#fff',
                    border: '1.5px solid #e8e8e4',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#2563eb',
                      boxShadow: '0 0 0 4px rgba(37,99,235,0.06)',
                      transform: 'translateY(-2px)',
                    },
                  }}>

                    {/* ── Thumbnail ── */}
                    <Box sx={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                      <Box
                        component="img"
                        src={enrollment.program.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'}
                        alt={enrollment.program.title}
                        sx={{
                          width: '100%', height: '100%', objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          '&:hover': { transform: 'scale(1.04)' },
                        }}
                      />
                      {/* Gradient overlay */}
                      <Box sx={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(10,10,10,0.72) 0%, transparent 55%)',
                      }} />

                      {/* Status pill — top right */}
                      <Box sx={{
                        position: 'absolute', top: 14, right: 14,
                        display: 'inline-flex', alignItems: 'center', gap: 0.75,
                        px: 1.75, py: 0.5, borderRadius: '100px',
                        bgcolor: isComplete ? '#dcfce7' : '#eff6ff',
                        border: '1px solid',
                        borderColor: isComplete ? '#bbf7d0' : '#bfdbfe',
                        fontSize: '0.7rem', fontWeight: 700,
                        color: isComplete ? '#15803d' : '#2563eb',
                        fontFamily: '"DM Sans", sans-serif',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}>
                        {isComplete
                          ? <><CheckCircle2 size={11} /> Completed</>
                          : <><PlayCircle size={11} /> In Progress</>
                        }
                      </Box>

                      {/* Domain + Title — bottom left */}
                      <Box sx={{ position: 'absolute', bottom: 16, left: 18, right: 18 }}>
                        <Box sx={{
                          display: 'inline-flex', alignItems: 'center',
                          px: 1.5, py: 0.35, borderRadius: '6px',
                          bgcolor: '#2563eb', mb: 1,
                        }}>
                          <Typography sx={{
                            fontSize: '0.65rem', fontWeight: 700, color: '#fff',
                            fontFamily: '"DM Sans", sans-serif',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                          }}>
                            {enrollment.program.internshipDomain}
                          </Typography>
                        </Box>
                        <Typography sx={{
                          fontWeight: 800, fontSize: '1.1rem', color: '#fff',
                          fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.02em',
                          lineHeight: 1.25,
                          textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                        }}>
                          {enrollment.program.title}
                        </Typography>
                      </Box>
                    </Box>

                    {/* ── Body ── */}
                    <Box sx={{ p: 3.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

                      {/* Meta row */}
                      <Box sx={{ display: 'flex', gap: 2.5, mb: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{
                            width: 20, height: 20, borderRadius: '50%',
                            bgcolor: '#f7f7f5', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', border: '1px solid #e8e8e4',
                          }}>
                            <Clock size={11} color="#737373" />
                          </Box>
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#737373', fontFamily: '"DM Sans", sans-serif' }}>
                            {enrollment.program.duration || '4 Weeks'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{
                            width: 20, height: 20, borderRadius: '50%',
                            bgcolor: '#f7f7f5', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', border: '1px solid #e8e8e4',
                          }}>
                            <BookOpen size={11} color="#737373" />
                          </Box>
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#737373', fontFamily: '"DM Sans", sans-serif' }}>
                            Self-Paced
                          </Typography>
                        </Box>
                      </Box>

                      {/* Current module */}
                      {enrollment.currentModule && (
                        <Box sx={{
                          p: 2.5,
                          bgcolor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '12px',
                          mb: 3,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
                        }}>
                          <Box sx={{ overflow: 'hidden' }}>
                            <Typography sx={{
                              fontSize: '0.65rem', fontWeight: 700, color: '#2563eb',
                              textTransform: 'uppercase', letterSpacing: '0.1em',
                              fontFamily: '"DM Sans", sans-serif', mb: 0.25,
                            }}>
                              Current Module
                            </Typography>
                            <Typography sx={{
                              fontWeight: 700, color: '#0a0a0a', fontSize: '0.875rem',
                              fontFamily: '"DM Sans", sans-serif',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {enrollment.currentModule.title}
                            </Typography>
                          </Box>
                          <ChevronRight size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                        </Box>
                      )}

                      {/* Progress */}
                      <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid #e8e8e4' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1.5 }}>
                          <Box>
                            <Typography sx={{
                              fontSize: '0.65rem', fontWeight: 700, color: '#a3a3a3',
                              textTransform: 'uppercase', letterSpacing: '0.1em',
                              fontFamily: '"DM Sans", sans-serif', mb: 0.25,
                            }}>
                              Completion
                            </Typography>
                            <Typography sx={{
                              fontWeight: 900, fontSize: '1.75rem', color: '#0a0a0a',
                              fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.04em', lineHeight: 1,
                            }}>
                              {pct}%
                            </Typography>
                          </Box>
                          {pct > 0 && pct < 100 && (
                            <Typography sx={{
                              fontSize: '0.75rem', fontWeight: 700, color: '#2563eb',
                              fontFamily: '"DM Sans", sans-serif',
                            }}>
                              Keep it up!
                            </Typography>
                          )}
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            height: 8, borderRadius: '100px',
                            mb: 3.5,
                            bgcolor: '#f7f7f5',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: '100px',
                              bgcolor: isComplete ? '#16a34a' : '#2563eb',
                            },
                          }}
                        />

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Button
                            component={Link}
                            to={`/learning/${enrollment.program._id}`}
                            variant="contained"
                            startIcon={<PlayCircle size={17} />}
                            sx={{
                              flex: 1,
                              bgcolor: '#0a0a0a', color: '#fff',
                              py: 1.5, fontWeight: 700, fontSize: '0.875rem',
                              borderRadius: '10px', boxShadow: 'none', textTransform: 'none',
                              fontFamily: '"DM Sans", sans-serif',
                              '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
                            }}
                          >
                            {pct === 0 ? 'Start Program' : 'Continue Learning'}
                          </Button>

                          {enrollment.isCertificateIssued && (
                            <Button
                              variant="outlined"
                              sx={{
                                width: 50, minWidth: 50, p: 0,
                                borderRadius: '10px',
                                borderColor: '#bbf7d0', borderWidth: '1.5px',
                                color: '#15803d', bgcolor: '#dcfce7',
                                '&:hover': { bgcolor: '#bbf7d0', borderColor: '#86efac' },
                              }}
                            >
                              <Award size={20} />
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyLearning;