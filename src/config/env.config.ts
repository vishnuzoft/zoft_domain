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
  JWT_SECRET: process.env.JWT_SECRET,
  API_URL: process.env.API_URL,
  API_USER_EMAIL: process.env.API_USER_EMAIL,
  API_KEY: process.env.API_KEY,
  DOMAIN_REGISTER: process.env.DOMAIN_REGISTER,
  SMS_API_URL: process.env.SMS_API_URL,
  SMS_USERNAME: process.env.SMS_USERNAME,
  SMS_PASSWORD: process.env.SMS_PASSWORD,
  SMS_SENDER_ID: process.env.SMS_SENDER_ID,
  DOMAIN_AVAILABILITY_CHECK: process.env.DOMAIN_AVAILABILITY_CHECK,
  API_TYPE: process.env.API_TYPE,
  API_VERSION: process.env.API_VERSION,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};
