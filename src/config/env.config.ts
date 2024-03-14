import * as dotenv from 'dotenv';

dotenv.config();
export const environment = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  PORT: process.env.PORT,
  IP_ADDRESS: process.env.IP_ADDRESS,
};
