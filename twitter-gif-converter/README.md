# Twitter GIF Converter

A Chrome extension that automatically converts GIFs to MP4 videos on Twitter/X for improved performance and reduced bandwidth usage.

## Overview

Twitter GIF Converter is a lightweight Chrome extension designed to enhance your Twitter browsing experience by automatically converting GIF images to MP4 video format. Since Twitter already stores GIFs as MP4 videos internally, this extension prevents the unnecessary conversion back to GIF format, resulting in significant bandwidth savings and smoother playback.

## Features

- **Automatic Conversion**: Seamlessly converts all GIFs to MP4 videos as you browse Twitter
- **Manual Toggle**: Enable/disable conversion with a single click from the extension popup
- **Bandwidth Tracking**: Monitor how much data you've saved with real-time statistics
- **Performance Boost**: MP4 videos use less CPU and memory compared to animated GIFs
- **Seamless Integration**: Works transparently without affecting your normal Twitter experience

## Installation

### From Chrome Web Store
1. Visit the Chrome Web Store (link coming soon)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `twitter-gif-converter` folder
6. The extension icon should appear in your toolbar

## Usage

1. **Automatic Mode**: Once installed, the extension works automatically. All GIFs on Twitter will be displayed as MP4 videos.

2. **Toggle On/Off**: Click the extension icon in your toolbar to open the popup and toggle conversion on or off.

3. **View Statistics**: The popup displays:
   - Total bandwidth saved
   - Number of GIFs converted in the current session
   - Current conversion status (enabled/disabled)

## How It Works

Twitter actually serves GIFs as MP4 videos to save bandwidth and improve performance. However, the Twitter web interface converts these videos back to GIF format for display, which:
- Increases file size by 2-10x
- Uses more CPU for rendering
- Causes stuttering on lower-end devices

This extension intercepts these conversions and displays the original MP4 videos directly, maintaining the same visual experience while improving performance.

## Technical Details

- **Manifest Version**: 2 (for broader compatibility)
- **Permissions Required**:
  - `activeTab`: To detect when you're on Twitter
  - `storage`: To save your preferences and statistics
  - `webRequest`: To intercept and modify GIF requests
  - `webRequestBlocking`: To prevent GIF conversion
  - Host permissions for `twitter.com` and `x.com`

## Privacy

This extension:
- Only operates on Twitter/X domains
- Does not collect or transmit any personal data
- Does not modify any content except GIF display format
- Stores statistics locally on your device only

## Browser Compatibility

- Chrome: Version 88+
- Edge: Version 88+
- Brave: Supported
- Opera: Version 74+

## Troubleshooting

**GIFs still showing as GIFs:**
- Ensure the extension is enabled in the popup
- Try refreshing the Twitter page
- Check that the extension has permission to run on Twitter

**Extension not working after Twitter update:**
- Twitter occasionally changes their code structure
- Check for extension updates
- Report issues on our GitHub page

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need for a more efficient Twitter browsing experience
- Built with vanilla JavaScript for minimal overhead
- Icon created using Canvas API for lightweight distribution

## Version History

- **1.0.0** (Current) - Initial release with core functionality
  - Automatic GIF to MP4 conversion
  - Toggle switch
  - Bandwidth tracking
  - Session statistics

## Future Enhancements

- [ ] Firefox support
- [ ] Custom conversion rules
- [ ] Whitelist/blacklist specific accounts
- [ ] Export statistics
- [ ] Dark mode for popup
- [ ] Keyboard shortcuts