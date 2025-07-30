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

    logger.info(`Generated video ID: ${videoId}`);
    logger.info(`Output directory: ${outputDir}`);

    logger.updateSpinner('Converting video to HLS...');
    await convertToHLS(options.video, outputDir);

    logger.updateSpinner('Validating HLS files...');
    const manifestPath = path.join(outputDir, 'playlist.m3u8');
    if (!(await fs.pathExists(manifestPath))) {
      throw new Error('HLS manifest file not generated');
    }

    // Leer todos los archivos generados
    const outputFiles = await fs.readdir(outputDir);
    logger.info(`Generated HLS files: ${outputFiles.join(', ')}`);

    const files = outputFiles.map(file => ({
      path: path.join(outputDir, file),
      name: file
    }));

    // Agregar thumbnail si existe
    if (options.thumbnail) {
      if (!(await fs.pathExists(options.thumbnail))) {
        throw new Error(`Thumbnail file not found: ${options.thumbnail}`);
      }
      files.push({
        path: options.thumbnail,
        name: `thumbnail${path.extname(options.thumbnail)}`
      });
      logger.info('Thumbnail added to upload queue');
    }

    logger.updateSpinner('Uploading files...');
    const result = await uploadFiles(files, videoId);

    logger.success('Upload completed successfully!');
    logger.info(`Video ID: ${result.videoId}`);
    logger.info(`Files uploaded: ${result.filesCount}`);
    logger.info(`Total size: ${result.totalSize ? Math.round(result.totalSize / 1024) + 'KB' : 'Unknown'}`);
    
    if (result.manifestUrl) {
      logger.info(`Manifest URL: ${result.manifestUrl}`);
    }
    
    if (result.embedCode) {
      logger.info('Embed code:');
      console.log(`\n${result.embedCode}\n`);
    }

    // Verificación adicional
    logger.startSpinner('Verifying upload...');
    try {
      const verifyUrl = `https://sponsorcast.vercel.app/api/verify/${videoId}`;
      const axios = await import('axios');
      const verifyResponse = await axios.default.get(verifyUrl);
      
      if (verifyResponse.data?.exists) {
        logger.success('Video verified on server!');
        logger.info(`Direct link: https://sponsorcast.vercel.app/video/${videoId}`);
      } else {
        logger.warn('Video upload may not have completed properly');
      }
    } catch (verifyError) {
      logger.warn('Could not verify upload (server may not have verify endpoint)');
    }

    // Cleanup local files
    try {
      await fs.remove(outputDir);
      logger.info('Cleaned up temporary files');
    } catch (cleanupError) {
      logger.warn(`Could not clean up temporary files: ${cleanupError.message}`);
    }

    return result;
  } catch (error) {
    logger.error(`Upload failed: ${error.message}`);
    throw error;
  }
};