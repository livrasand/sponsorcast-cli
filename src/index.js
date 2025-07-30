const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const uploadCommand = require('./commands/upload');

module.exports = {
  run: async () => {
    program
      .name('sponsorcast')
      .description(chalk.blueBright('CLI tool for uploading videos to Sponsorcast'))
      .version('1.0.0');

    program
      .command('upload')
      .description('Upload a video to Sponsorcast')
      .action(async () => {
        // Preguntar interactivamente las opciones
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'video',
            message: chalk.cyan('Path to the video file:'),
            validate(input) {
              if (!input) return 'Por favor ingresa la ruta del video.';
              return true;
            }
          },
          {
            type: 'input',
            name: 'name',
            message: chalk.cyan('Name for the video (optional):')
          },
          {
            type: 'input',
            name: 'thumbnail',
            message: chalk.cyan('Path to the thumbnail image (optional):')
          }
        ]);

        // Spinner mientras sube
        const spinner = ora('Uploading video...').start();

        try {
          await uploadCommand(answers);
          spinner.succeed(chalk.green('Video uploaded successfully! 🎉'));
        } catch (err) {
          spinner.fail(chalk.red('Upload failed: ' + err.message));
        }
      });

    program.parse(process.argv);
  }
};

// Ejecutar solo si es el módulo principal
if (require.main === module) {
  module.exports.run();
}
