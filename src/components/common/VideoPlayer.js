import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { getVideoDetails } from '../../utils/videoHelpers';

/**
 * VideoPlayer component that handles YouTube, Vimeo, and direct MP4 links
 * with automatic embed URL conversion and graceful fallback.
 */
const VideoPlayer = ({ url, title }) => {
  const { type, embedUrl } = getVideoDetails(url);

  if (!url) {
    return (
      <Box sx={{ 
        height: 400, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'rgba(0,0,0,0.02)',
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider'
      }}>
        <AlertCircle size={48} color="#ef4444" />
        <Typography variant="h6" sx={{ mt: 2 }} color="error">No video URL provided</Typography>
      </Box>
    );
  }

  // Handle direct video files (MP4)
  if (type === 'direct') {
    return (
      <Box sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'black' }}>
        <video 
          controls 
          style={{ width: '100%', display: 'block' }}
          src={embedUrl}
        >
          Your browser does not support the video tag.
        </video>
      </Box>
    );
  }

  // Handle YouTube, Vimeo, or potentially embeddable URLs
  // We use a responsive wrapper for iframes (16:9 aspect ratio)
  if (type === 'youtube' || type === 'vimeo' || (type === 'unknown' && embedUrl)) {
    return (
      <Box sx={{ 
        position: 'relative', 
        pt: '56.25%', // 16:9 Aspect Ratio
        bgcolor: 'black', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <iframe
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            border: 0 
          }}
          src={embedUrl}
          title={title || "Video Player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </Box>
    );
  }

  // Fallback UI for non-embeddable content
  return (
    <Box sx={{ 
      p: 6, 
      textAlign: 'center', 
      border: '1px dashed', 
      borderColor: 'divider', 
      borderRadius: 2,
      bgcolor: 'rgba(0,0,0,0.01)'
    }}>
      <Typography variant="h6" gutterBottom>
        External Video Content
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This video content is hosted on an external platform that doesn't support direct embedding.
      </Typography>
      <Button 
        variant="contained" 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        startIcon={<ExternalLink size={18} />}
      >
        Open Video in New Tab
      </Button>
    </Box>
  );
};

export default VideoPlayer;
