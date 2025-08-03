import FormData from 'form-data';
import fs from 'fs-extra';
import axios from 'axios';
import { logger } from './logger.js';

export const uploadFiles = async (files, videoId, token) => {
  try {
    const form = new FormData();

    // Agregar archivos con mejor logging
    logger.info(`Preparing to upload ${files.length} files for video ID: ${videoId}`);
    
    for (const file of files) {
      if (!(await fs.pathExists(file.path))) {
        throw new Error(`File not found: ${file.path}`);
      }
      const stats = await fs.stat(file.path);
      logger.info(`Adding file: ${file.name} (${Math.round(stats.size / 1024)}KB)`);
      form.append('files', fs.createReadStream(file.path), file.name);
    }

    form.append('videoId', videoId);

    const API_URL = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/upload-hls' 
      : 'https://sponsorcast.vercel.app/api/upload-hls';

    logger.info(`Uploading to: ${API_URL}`);

    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000 // Aumentar timeout a 2 minutos
    });

    // Logging detallado de la respuesta
    logger.info(`Response status: ${response.status}`);
    logger.info(`Response data: ${JSON.stringify(response.data, null, 2)}`);

    if (!response.data?.success) {
      throw new Error(response.data?.error || 'Server error');
    }

    // Construir la URL del manifest si no viene en la respuesta
    const manifestUrl = response.data.playUrl || 
                       response.data.manifestUrl || 
                       `${API_URL.replace('/api/upload-hls', '')}/api/playlist/${videoId}`;

    const result = {
      success: true,
      videoId: response.data.videoId || videoId,
      filesCount: response.data.files?.length || files.length,
      manifestUrl: manifestUrl,
      embedCode: response.data.embedCode,
      totalSize: response.data.totalSize
    };

    logger.info(`Upload result: ${JSON.stringify(result, null, 2)}`);
    
    return result;
  } catch (error) {
    if (error.response) {
      logger.error(`Server responded with status ${error.response.status}`);
      logger.error(`Server error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      logger.error('No response received from server');
      logger.error(`Request details: ${error.message}`);
    } else {
      logger.error(`Request setup error: ${error.message}`);
    }
    throw error;
  }
};