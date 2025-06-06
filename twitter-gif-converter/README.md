# Twitter Video to GIF Converter

A Firefox extension that converts Twitter/X videos to GIF files.

## Features

- Simple popup interface
- Paste Twitter/X video URL
- Specify custom filename
- Downloads GIF to your Downloads folder
- Works with both twitter.com and x.com URLs

## Installation

### For Testing (Temporary Installation)

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the extension folder and select `manifest.json`

### For Android Testing

1. Install Firefox for Android Nightly
2. Enable USB debugging on your Android device
3. Connect device to computer
4. Use web-ext: `npm install -g web-ext`
5. Run: `web-ext run -t firefox-android`

## Usage

1. Click the extension icon in your browser toolbar
2. Paste a Twitter/X video URL (e.g., `https://x.com/user/status/123456789`)
3. Enter a filename (without extension)
4. Click "Download as GIF"
5. The GIF will be saved to your Downloads folder

## Notes

- The extension extracts video URLs from Twitter/X pages
- Videos are converted to GIF format with reduced quality for smaller file sizes
- Maximum GIF duration is 30 seconds
- GIF resolution is limited to 480px width to keep file sizes manageable

## Limitations

- Requires access to Twitter/X pages to extract video URLs
- Some videos may be protected or unavailable
- GIF conversion happens in the browser, which may be slow for long videos

## Permissions

- `activeTab`: To access the current tab
- `downloads`: To save GIF files
- `<all_urls>`: To fetch video content
- `webRequest`: To intercept and handle video requests
- `storage`: To store extension settings