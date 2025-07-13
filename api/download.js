// api/download.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { videoId, format, quality } = req.body;
    
    if (!videoId || !format) {
      return res.status(400).json({ error: 'Video ID and format are required' });
    }

    // Since direct downloading is complex and resource-intensive on Vercel,
    // we'll redirect to reliable external services
    const fallbackServices = {
      mp3: `https://yt1s.com/en/youtube-to-mp3`,
      mp4: `https://yt1s.com/en/youtube-to-mp4`
    };
    
    res.status(200).json({
      success: false,
      fallbackUrl: fallbackServices[format] || fallbackServices.mp3,
      message: 'Redirecting to external download service',
      videoUrl: `https://youtu.be/${videoId}`,
      format: format,
      quality: quality
    });
    
  } catch (error) {
    console.error('Download error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Download service unavailable',
      fallbackUrl: 'https://yt1s.com/en/youtube-to-mp3',
      videoUrl: `https://youtu.be/${videoId}`
    });
  }
}