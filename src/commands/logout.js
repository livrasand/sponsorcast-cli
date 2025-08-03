import ora from 'ora';
import chalk from 'chalk';
import axios from 'axios';
import { clearToken, getToken } from '../utils/config.js';

async function logout() {
  const spinner = ora('Logging out...').start();

  try {
    // 1. Intentar hacer logout en el servidor si hay token
    const token = await getToken();
    if (token) {
      await axios.post('https://sponsorcast.vercel.app/api/creators/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true // Importante para manejar cookies si es necesario
      });
    }

    // 2. Limpiar token localmente
    await clearToken();
    
    spinner.succeed(chalk.green('Logout successful!'));
  } catch (error) {
    // Si falla el logout remoto, igual limpiamos localmente
    await clearToken();
    
    if (error.response) {
      // Error de API
      spinner.fail(chalk.red(error.response.data.error || 'Logout failed'));
    } else {
      // Error de red u otro
      spinner.fail(chalk.red('Logout completed locally (network error)'));
    }
  }
}

export default logout;