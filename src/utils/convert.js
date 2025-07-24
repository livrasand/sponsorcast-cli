import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';

export const convertToHLS = async (inputPath, outputDir) => {
  try {
    // Validate input file exists
    if (!(await fs.pathExists(inputPath))) {
      throw new Error(`Input video file not found: ${inputPath}`);
    }

    // Ensure output directory exists
    await fs.ensureDir(outputDir);
    
    // Check if ffmpeg is available
    if (!ffmpegPath) {
      throw new Error('FFmpeg not found. Please install ffmpeg-static or ensure FFmpeg is available in PATH.');
    }

    const outputPath = path.join(outputDir, 'playlist.m3u8');
    
    console.log(`Converting ${path.basename(inputPath)} to HLS format...`);

    // Convert with better HLS settings for streaming
    execSync(
      `"${ffmpegPath}" -i "${inputPath}" ` +
      `-c:v libx264 -c:a aac ` +
      `-start_number 0 -hls_time 10 -hls_list_size 0 ` +
      `-hls_segment_filename "${path.join(outputDir, 'segment_%03d.ts')}" ` +
      `-f hls "${outputPath}"`,
      { stdio: 'pipe' }
    );

    // Verify output was created
    if (!(await fs.pathExists(outputPath))) {
      throw new Error('HLS conversion failed - no output files generated');
    }

    return true;
  } catch (error) {
    throw new Error(`Video conversion failed: ${error.message}`);
  }
};
