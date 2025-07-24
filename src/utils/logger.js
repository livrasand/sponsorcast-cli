import chalk from 'chalk';
import ora from 'ora';

class Logger {
  constructor() {
    this.spinner = ora();
  }

  info(message) {
    this.spinner.info(chalk.blue(`ℹ ${message}`));
  }

  success(message) {
    this.spinner.succeed(chalk.green(`✓ ${message}`));
  }

  warn(message) {
    this.spinner.warn(chalk.yellow(`⚠ ${message}`));
  }

  error(message) {
    this.spinner.fail(chalk.red(`✗ ${message}`));
  }

  startSpinner(message) {
    this.spinner.start(chalk.cyan(`⌛ ${message}`));
  }

  updateSpinner(message) {
    this.spinner.text = chalk.cyan(`⌛ ${message}`);
  }
}

export const logger = new Logger();