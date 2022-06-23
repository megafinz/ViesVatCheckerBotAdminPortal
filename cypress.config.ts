import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  e2e: {
    setupNodeEvents(_, config) {
      config.env.HOST = process.env.HOST;
      config.env.PORT = process.env.PORT;
      config.env.E2E_API_URL = process.env.E2E_API_URL;
      return config;
    }
  }
});
