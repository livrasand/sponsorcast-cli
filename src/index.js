const { program } = require('commander');
const uploadCommand = require('./commands/upload');

// Exportar para pruebas
module.exports = {
  run: () => {
    program
      .name('sponsorcast')
      .description('CLI tool for uploading videos to Sponsorcast')
      .version('1.0.0');

    program.command('upload')
      .description('Upload a video to Sponsorcast')
      .requiredOption('--video <path>', 'Path to the video file')
      .option('--name <name>', 'Name for the video')
      .option('--thumbnail <path>', 'Path to the thumbnail image')
      .action(async (options) => {
        await uploadCommand(options);
      });

    program.parse(process.argv);
  }
};

// Ejecutar solo si es el módulo principal
if (require.main === module) {
  module.exports.run();
}