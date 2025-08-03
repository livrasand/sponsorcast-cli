
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const configPath = path.join(os.homedir(), '.sponsorcast');

async function saveToken(token) {
  await fs.writeJson(configPath, { token });
}

async function getToken() {
  try {
    const config = await fs.readJson(configPath);
    return config.token;
  } catch (error) {
    return null;
  }
}

async function clearToken() {
    await fs.remove(configPath);
}

export { saveToken, getToken, clearToken };
