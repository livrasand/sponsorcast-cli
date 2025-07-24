import crypto from 'crypto';
import path from 'path';

export const generateUniqueVideoId = (videoPath, customName) => {
  // Create a hash from the file path and timestamp
  const hash = crypto.createHash('md5')
    .update(videoPath + Date.now())
    .digest('hex')
    .substring(0, 8);
  
  // Generate a random string
  const randomString = crypto.randomBytes(4).toString('hex');
  
  // Use custom name or extract from file
  const baseName = customName || path.basename(videoPath, path.extname(videoPath));
  
  // Clean the name (remove special characters, spaces)
  const cleanName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30); // Limit length
  
  return `${cleanName}-${hash}-${randomString}`;
};
