import { logger } from '../utils/logger.js';
import { convertToHLS } from '../utils/convert.js';
import { uploadFiles } from '../utils/upload.js';
import { generateUniqueVideoId } from '../utils/generateId.js';
import fs from 'fs-extra';
import path from 'path';

export default async (options) => {
  try {
    logger.startSpinner('Validating video file...');
    if (!(await fs.pathExists(options.video))) {
      throw new Error(`Video file not found: ${options.video}`);
    }

    // Generate unique video ID
    const videoId = generateUniqueVideoId(options.video, options.name);
    const outputDir = path.join(process.cwd(), 'output', videoId);

    logger.updateSpinner('Converting video to HLS...');
    await convertToHLS(options.video, outputDir);

    logger.updateSpinner('Validating HLS files...');
    const manifestPath = path.join(outputDir, 'playlist.m3u8');
    if (!(await fs.pathExists(manifestPath))) {
      throw new Error('HLS manifest file not generated');
    }

    const files = (await fs.readdir(outputDir)).map(file => ({
      path: path.join(outputDir, file),
      name: file
    }));

    if (options.thumbnail) {
      if (!(await fs.pathExists(options.thumbnail))) {
        throw new Error(`Thumbnail file not found: ${options.thumbnail}`);
      }
      files.push({
        path: options.thumbnail,
        name: `thumbnail${path.extname(options.thumbnail)}`
      });
    }

    logger.updateSpinner('Uploading files...');
    const result = await uploadFiles(files, videoId);

    logger.success('Upload completed successfully!');
    logger.info(`Video ID: ${result.videoId}`);
    logger.info(`Files uploaded: ${result.filesCount}`);
    logger.info(`Manifest URL: ${result.manifestUrl}`);

    return result;
  } catch (error) {
    logger.error(`Upload failed: ${error.message}`);
    throw error;
  }
};