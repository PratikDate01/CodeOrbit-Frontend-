import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Target, 
  Zap, 
  GraduationCap, 
  Award,
  CircleHelp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeeExplanation = () => {
  const feeDetails = [
    {
      title: "Training & Resources",
      desc: "High-quality project guidelines, curated learning resources, and technical support to ensure you build industry-grade projects.",
      icon: <GraduationCap size={24} />
    },
    {
      title: "Verification Infrastructure",
      desc: "Permanent QR-based digital verification system for recruiters and colleges to verify your credentials anytime, anywhere.",
      icon: <ShieldCheck size={24} />
    },
    {
      title: "Admin & Operations",
      desc: "Processing applications, managing dashboard infrastructure, and ensuring timely issuance of offer letters and certificates.",
      icon: <Zap size={24} />
    },
    {
      title: "Cloud Infrastructure",
      desc: "Maintenance of the project submission portal, cloud storage for your work, and automated evaluation systems.",
      icon: <Target size={24} />
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 }, mt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Box sx={{ display: 'inline-flex', p: 1, px: 2, bgcolor: 'primary.light', color: 'primary.main', borderRadius: 4, mb: 3, alignItems: 'center', gap: 1 }}>
            <CircleHelp size={18} />
            <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              Transparency Policy
            </Typography>
          </Box>
          <Typography variant="h2" fontWeight={800} gutterBottom sx={{ letterSpacing: '-1px' }}>
            Why We Charge?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 500 }}>
            At CodeOrbit, we believe in radical transparency. We don't hide our fees, and we want you to know exactly where your contribution goes.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
               selección is Free. <br />
              <span style={{ color: '#4b5563' }}>Preparation has a cost.</span>
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem' }}>
              We do NOT charge for job placement or for the "selection" process. The internship fee is a <strong>one-time technical and administrative fee</strong> that covers the following essential pillars of your internship experience:
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {feeDetails.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 5, borderRadius: 5, bgcolor: 'primary.main', color: 'white', position: 'sticky', top: 100 }}>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                What you get:
              </Typography>
              <List sx={{ mt: 3 }}>
                {[
                  "Verified Offer Letter (Digital)",
                  "QR-Based Completion Certificate",
                  "Letter of Recommendation (LOC)",
                  "Project Review & Feedback",
                  "Lifetime Verification Support",
                  "Industry-Relevant Project Experience"
                ].map((text, i) => (
                  <ListItem key={i} disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
                      <CheckCircle2 size={20} />
                    </ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ fontWeight: 600 }} />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 4, lineHeight: 1.7 }}>
                By charging a nominal fee, we filter out non-serious applicants and maintain a high standard of quality for those truly committed to their growth.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                component={Link} 
                to="/internships"
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main', 
                  py: 1.5,
                  '&:hover': { bgcolor: '#f1f5f9' }
                }}
              >
                Browse Internships
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FeeExplanation;
