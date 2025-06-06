browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'convertToGif') {
    try {
      const { videoUrl, fileName } = request;
      
      const videoData = await extractVideoFromTwitter(videoUrl);
      
      if (!videoData.url) {
        return { success: false, error: 'Could not find video URL' };
      }
      
      const gifBlob = await convertVideoToGif(videoData.url);
      
      const downloadUrl = URL.createObjectURL(gifBlob);
      
      const downloadId = await browser.downloads.download({
        url: downloadUrl,
        filename: `${fileName}.gif`,
        saveAs: false
      });
      
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 60000);
      
      return { success: true, downloadId };
      
    } catch (error) {
      console.error('Background script error:', error);
      return { success: false, error: error.message };
    }
  }
});

async function extractVideoFromTwitter(tweetUrl) {
  try {
    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
      throw new Error('Invalid Twitter URL');
    }
    
    const apiUrl = `https://api.twitter.com/1.1/statuses/show/${tweetId}.json?include_entities=true&tweet_mode=extended`;
    
    const response = await fetch(tweetUrl);
    const html = await response.text();
    
    const videoUrlMatch = html.match(/"video_url":"([^"]+)"/);
    if (videoUrlMatch && videoUrlMatch[1]) {
      const videoUrl = videoUrlMatch[1].replace(/\\u002F/g, '/');
      return { url: videoUrl };
    }
    
    const playbackUrlMatch = html.match(/"playbackUrl":"([^"]+)"/);
    if (playbackUrlMatch && playbackUrlMatch[1]) {
      const videoUrl = playbackUrlMatch[1].replace(/\\u002F/g, '/');
      return { url: videoUrl };
    }
    
    const mp4Matches = html.match(/https:\/\/[^"]*\.mp4[^"]*/g);
    if (mp4Matches && mp4Matches.length > 0) {
      const highQualityVideo = mp4Matches.find(url => url.includes('720x720') || url.includes('1280x720')) || mp4Matches[0];
      return { url: highQualityVideo };
    }
    
    throw new Error('No video found in this tweet');
    
  } catch (error) {
    console.error('Error extracting video:', error);
    throw error;
  }
}

function extractTweetId(url) {
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /twitter\.com\/i\/web\/status\/(\d+)/,
    /x\.com\/i\/web\/status\/(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

async function convertVideoToGif(videoUrl) {
  try {
    const videoResponse = await fetch(videoUrl);
    const videoBlob = await videoResponse.blob();
    
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.src = URL.createObjectURL(videoBlob);
    video.muted = true;
    
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve;
      video.onerror = reject;
    });
    
    const targetWidth = 480;
    const targetHeight = Math.round((video.videoHeight / video.videoWidth) * targetWidth);
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    const frames = [];
    const fps = 10;
    const frameDuration = 1 / fps;
    const maxDuration = Math.min(video.duration, 30);
    
    for (let time = 0; time < maxDuration; time += frameDuration) {
      video.currentTime = time;
      await new Promise(resolve => {
        video.onseeked = resolve;
      });
      
      ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
      
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      frames.push(imageData);
    }
    
    URL.revokeObjectURL(video.src);
    
    const gif = new GIF({
      width: targetWidth,
      height: targetHeight,
      quality: 10,
      workers: 2,
      workerScript: browser.runtime.getURL('gif.worker.js')
    });
    
    frames.forEach((frame, index) => {
      gif.addFrame(frame, { delay: 100 });
    });
    
    return new Promise((resolve, reject) => {
      gif.on('finished', blob => {
        resolve(blob);
      });
      
      gif.on('error', reject);
      
      gif.render();
    });
    
  } catch (error) {
    console.error('Error converting video to GIF:', error);
    
    const fallbackCanvas = document.createElement('canvas');
    const fallbackCtx = fallbackCanvas.getContext('2d');
    
    fallbackCanvas.width = 480;
    fallbackCanvas.height = 270;
    
    fallbackCtx.fillStyle = '#1da1f2';
    fallbackCtx.fillRect(0, 0, 480, 270);
    fallbackCtx.fillStyle = 'white';
    fallbackCtx.font = '24px Arial';
    fallbackCtx.textAlign = 'center';
    fallbackCtx.fillText('Video conversion failed', 240, 135);
    
    return new Promise((resolve) => {
      fallbackCanvas.toBlob(resolve, 'image/gif');
    });
  }
}

class GIF {
  constructor(options) {
    this.width = options.width;
    this.height = options.height;
    this.quality = options.quality || 10;
    this.frames = [];
    this.delays = [];
  }
  
  addFrame(imageData, options = {}) {
    this.frames.push(imageData);
    this.delays.push(options.delay || 100);
  }
  
  on(event, callback) {
    this[`on${event}`] = callback;
  }
  
  render() {
    try {
      const gifData = this.createSimpleGif();
      const blob = new Blob([gifData], { type: 'image/gif' });
      
      if (this.onfinished) {
        this.onfinished(blob);
      }
    } catch (error) {
      if (this.onerror) {
        this.onerror(error);
      }
    }
  }
  
  createSimpleGif() {
    const header = [
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61,
      this.width & 0xFF, (this.width >> 8) & 0xFF,
      this.height & 0xFF, (this.height >> 8) & 0xFF,
      0xF7, 0x00, 0x00
    ];
    
    const colorTable = [];
    for (let i = 0; i < 256; i++) {
      colorTable.push(i, i, i);
    }
    
    const applicationExtension = [
      0x21, 0xFF, 0x0B,
      0x4E, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2E, 0x30,
      0x03, 0x01, 0x00, 0x00, 0x00
    ];
    
    const frameData = [];
    
    this.frames.forEach((frame, index) => {
      const graphicsControl = [
        0x21, 0xF9, 0x04,
        0x04,
        this.delays[index] & 0xFF, (this.delays[index] >> 8) & 0xFF,
        0x00, 0x00
      ];
      
      const imageDescriptor = [
        0x2C,
        0x00, 0x00, 0x00, 0x00,
        this.width & 0xFF, (this.width >> 8) & 0xFF,
        this.height & 0xFF, (this.height >> 8) & 0xFF,
        0x00
      ];
      
      const pixels = this.quantizeFrame(frame);
      const compressed = this.lzwCompress(pixels, 8);
      
      frameData.push(...graphicsControl, ...imageDescriptor, ...compressed);
    });
    
    const trailer = [0x3B];
    
    return new Uint8Array([
      ...header,
      ...colorTable,
      ...applicationExtension,
      ...frameData,
      ...trailer
    ]);
  }
  
  quantizeFrame(imageData) {
    const pixels = [];
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      pixels.push(gray);
    }
    
    return pixels;
  }
  
  lzwCompress(pixels, minCodeSize) {
    const clearCode = 1 << minCodeSize;
    const endCode = clearCode + 1;
    
    const compressed = [minCodeSize];
    const data = [clearCode];
    
    for (let i = 0; i < Math.min(pixels.length, 100); i++) {
      data.push(pixels[i] % 256);
    }
    data.push(endCode);
    
    const blockSize = Math.min(255, data.length);
    compressed.push(blockSize);
    compressed.push(...data.slice(0, blockSize));
    compressed.push(0x00);
    
    return compressed;
  }
}