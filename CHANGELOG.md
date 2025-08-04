# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-04

### Added
- Initial release of Sponsorcast CLI
- Upload command for video files to Sponsorcast platform
- Login/logout functionality 
- Automatic HLS video conversion
- Unique video ID generation to prevent naming conflicts
- Thumbnail support for uploaded videos
- Progress indicators during upload process
- Cross-platform compatibility (Windows, macOS, Linux)
- Command-line interface with intuitive options

### Features
- **Video Upload**: Upload videos directly to Sponsorcast with `sponsorcast upload --video <path>`
- **Authentication**: Secure login/logout system
- **Video Processing**: Automatic conversion to HLS format
- **Customization**: Support for custom video names and thumbnails
- **ID Generation**: Automatic unique ID generation using MD5 hash + timestamp + random string
- **User Experience**: Beautiful CLI with progress bars and colored output

### Requirements
- Node.js 16.0.0 or higher
- NPM 7.0.0 or higher  
- FFmpeg (for video conversion)

### Dependencies
- `axios` - HTTP client for API requests
- `chalk` - Terminal string styling
- `commander` - Command-line interface framework
- `form-data` - Multipart form data handling
- `fs-extra` - Enhanced file system utilities
- `inquirer` - Interactive command line prompts
- `ora` - Elegant terminal spinners
