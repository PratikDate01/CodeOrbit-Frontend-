import React from 'react';
import { Box, Typography, Container, Grid, Link, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MSMELogo from '../assets/logos/MSME LOGO.png';
import AICTELogo from '../assets/logos/AICTE LOGO.png';
import CompanyLogo from '../assets/logos/Company Logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0f0f0f',
        color: '#ffffff',
        pt: { xs: 8, md: 10 },
        pb: 4,
        mt: 10
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Company Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                component="img" 
                src={CompanyLogo} 
                alt="CodeOrbit Logo" 
                sx={{ height: 45, mr: 1.5, filter: 'brightness(0) invert(1)' }} 
              />
              <Typography 
                variant="h5" 
                sx={{
                  fontWeight: 800,
                  fontSize: '1.75rem',
                  color: '#ffffff',
                }}
              >
                CodeOrbit
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.7)',
                mb: 3,
                fontSize: '0.95rem'
              }}
            >
              Empowering businesses with innovative IT solutions and nurturing future tech talent through professional internship programs.
            </Typography>
            
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, display: 'block', mb: 2 }}>
              Recognized By
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
              <Box 
                component="img" 
                src={MSMELogo} 
                alt="MSME Logo" 
                sx={{ height: 40, bgcolor: 'white', p: 0.5, borderRadius: 1 }} 
              />
              <Box 
                component="img" 
                src={AICTELogo} 
                alt="AICTE Logo" 
                sx={{ height: 40, bgcolor: 'white', p: 0.5, borderRadius: 1 }} 
              />
            </Box>

            {/* Social Media */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {[
                { icon: <LinkedInIcon />, label: 'LinkedIn' },
                { icon: <TwitterIcon />, label: 'Twitter' },
                { icon: <FacebookIcon />, label: 'Facebook' },
                { icon: <InstagramIcon />, label: 'Instagram' }
              ].map((social) => (
                <IconButton 
                  key={social.label}
                  aria-label={social.label}
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    '&:hover': { 
                      color: '#ffffff',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  mb: 2.5,
                  color: '#ffffff'
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: { xs: 'center', sm: 'flex-start' } }}>
                {[
                  { text: 'Home', path: '/' },
                  { text: 'About Us', path: '/about' },
                  { text: 'Services', path: '/services' },
                  { text: 'Internships', path: '/internships' },
                  { text: 'For Colleges', path: '/colleges' },
                  { text: 'Verify Document', path: '/verify' },
                  { text: 'Contact', path: '/contact' }
                ].map((link) => (
                  <Link
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: '#ffffff',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Services */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  mb: 2.5,
                  color: '#ffffff'
                }}
              >
                Our Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: { xs: 'center', sm: 'flex-start' } }}>
                {[
                  'Web Development',
                  'Custom Software',
                  'IT Consulting',
                  'Mobile Apps',
                  'Cloud Solutions'
                ].map((service) => (
                  <Typography
                    key={service}
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#ffffff',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    {service}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  mb: 2.5,
                  color: '#ffffff'
                }}
              >
                Get In Touch
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <EmailIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', mt: 0.3 }} />
                  <Link
                    href="mailto:codeorbit.internship@gmail.com"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.2s ease',
                      '&:hover': { color: '#ffffff' }
                    }}
                  >
                    codeorbit.internship@gmail.com
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <PhoneIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', mt: 0.3 }} />
                  <Link
                    href="tel:+917666394641"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.2s ease',
                      '&:hover': { color: '#ffffff' }
                    }}
                  >
                    +91 7666394641
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationOnIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', mt: 0.3 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    Whitehouse Vadgaon Bk Pune 41
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography 
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.9rem'
            }}
          >
            © {currentYear} CodeOrbit. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              component={RouterLink}
              to="/privacy"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#ffffff' }
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#ffffff' }
              }}
            >
              Terms of Service
            </Link>
            <Link
              component={RouterLink}
              to="/refund"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#ffffff' }
              }}
            >
              Refund Policy
            </Link>
            <Link
              component={RouterLink}
              to="/fee-structure"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#ffffff' }
              }}
            >
              Fee Structure
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;