import FormData from 'form-data';
import fs from 'fs-extra';
import axios from 'axios';
import { logger } from './logger.js';

export const uploadFiles = async (files, videoId) => {
  try {
    const form = new FormData();

    for (const file of files) {
      if (!(await fs.pathExists(file.path))) {
        throw new Error(`File not found: ${file.path}`);
      }
      form.append('files', fs.createReadStream(file.path), file.name);
    }

    form.append('videoId', videoId);

    const API_URL = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/upload-hls' 
      : 'https://sponsorcast.vercel.app/api/upload-hls';

    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
        'Accept': 'application/json'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 60000
    });

    if (!response.data?.success) {
      throw new Error(response.data?.error || 'Server error');
    }

    return {
      success: true,
      videoId: response.data.videoId,
      filesCount: response.data.filesCount,
      manifestUrl: response.data.manifestUrl
    };
  } catch (error) {
    logger.error(`Upload failed: ${error.message}`);
    throw error;
  }
};