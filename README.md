# Sponsorcast CLI

CLI tool for uploading videos to Sponsorcast - the exclusive video platform for GitHub Sponsors.

## Installation

```bash
npm install -g sponsorcast-cli
```

## Usage

### Upload a video

```bash
sponsorcast upload --video ./my-video.mp4
```

### Upload with custom name and thumbnail

```bash
sponsorcast upload --video ./my-video.mp4 --name "My Awesome Tutorial" --thumbnail ./thumb.jpg
```

## Options

- `--video <path>` (required): Path to the video file
- `--name <name>` (optional): Custom name for the video
- `--thumbnail <path>` (optional): Path to thumbnail image

## Features

- ✅ Automatic HLS conversion
- ✅ Unique video ID generation (prevents naming conflicts)
- ✅ Direct upload to Sponsorcast server
- ✅ Thumbnail support
- ✅ Progress indicators

## Requirements

- Node.js 16+
- FFmpeg (for video conversion)

## Video ID Generation

To prevent naming conflicts, the CLI automatically generates unique video IDs using:
- Cleaned video name
- MD5 hash of file path + timestamp
- Random string

Example: `my-tutorial-a1b2c3d4-e5f6g7h8`

Here’s the translation to English:

---

## Test locally

From the root of the project (where `package.json` is located):

```bash
npm link
```

This creates a global symlink on your system, as if you had installed the package from npm.

✅ 3. Run the command as if it were global
Now you can run your CLI from anywhere on your system using:

```bash
sponsorcast
```

You should see the output of the script in the console (e.g., *Sponsorcast CLI is working!*).

✅ 4. When you're done testing
To uninstall the symlink:

```bash
npm unlink
```

Or, if you need to restart the link (e.g., if changes aren’t being reflected):

```bash
npm unlink
npm link
```
