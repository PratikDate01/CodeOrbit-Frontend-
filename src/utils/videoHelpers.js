/**
 * Helper to extract video details and convert URLs to embeddable formats
 * @param {string} url - The video URL (YouTube, Vimeo, or Direct MP4)
 * @returns {object} - { type: 'youtube'|'vimeo'|'direct'|'unknown', embedUrl: string, id?: string }
 */
export const getVideoDetails = (url) => {
  if (!url) return { type: 'unknown', embedUrl: null };

  // YouTube normalization
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, etc.
  const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const youtubeMatch = url.match(youtubeRegExp);
  if (youtubeMatch && youtubeMatch[2].length === 11) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[2]}`,
      id: youtubeMatch[2]
    };
  }

  // Vimeo normalization
  // Matches: vimeo.com/ID, vimeo.com/channels/ID, etc.
  const vimeoRegExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
  const vimeoMatch = url.match(vimeoRegExp);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
      id: vimeoMatch[3]
    };
  }

  // Direct MP4
  if (url.toLowerCase().split('?')[0].endsWith('.mp4')) {
    return {
      type: 'direct',
      embedUrl: url
    };
  }

  // Fallback for already embeddable or unknown URLs
  return {
    type: 'unknown',
    embedUrl: url
  };
};
