import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import axios from 'axios';
import { saveToken } from '../utils/config.js';

async function login() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Enter your Sponsorcast username:',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your Sponsorcast password:',
    },
  ]);

  const spinner = ora('Logging in...').start();

  try {
    const { data } = await axios.post('https://sponsorcast.vercel.app/api/creators/login', {
      username: answers.username.toLowerCase(),
      password: answers.password,
    }, {
      withCredentials: true, // Para manejar cookies si es necesario
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (data.success && data.token) {
      await saveToken(data.token);
      spinner.succeed(chalk.green('Login successful!'));
    } else {
      spinner.fail(chalk.red(data.error || 'Login failed. Please check your credentials.'));
    }
  } catch (error) {
    let errorMessage = 'Login failed. Please check your credentials.';
    if (error.response) {
      errorMessage = error.response.data.error || errorMessage;
    }
    spinner.fail(chalk.red(errorMessage));
  }
}

export default login;