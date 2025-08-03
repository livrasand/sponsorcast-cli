#!/usr/bin/env node
import { program } from 'commander';
import uploadCommand from '../src/commands/upload.js';
import loginCommand from '../src/commands/login.js';
import logoutCommand from '../src/commands/logout.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

program
  .name('sponsorcast')
  .description('CLI tool for uploading videos to Sponsorcast')
  .version('1.0.0');

program.command('login')
  .description('Login to Sponsorcast')
  .action(loginCommand);

program.command('logout')
  .description('Logout from Sponsorcast')
  .action(logoutCommand);

program.command('upload')
  .description('Upload a video to Sponsorcast')
  .requiredOption('--video <path>', 'Path to the video file')
  .option('--name <name>', 'Name for the video')
  .option('--thumbnail <path>', 'Path to the thumbnail image')
  .action(async (options) => {
    try {
      if (options.video) {
        options.video = path.resolve(__dirname, '..', options.video);
      }
      if (options.thumbnail) {
        options.thumbnail = path.resolve(__dirname, '..', options.thumbnail);
      }
      await uploadCommand(options);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);