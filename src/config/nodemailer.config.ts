
import { environment } from './env.config';

const nodemailer = require("nodemailer");


export const transporter = nodemailer.createTransport({
    service:"gmail",
//   pool: environment.EMAIL_POOL,
//   host: environment.EMAIL_HOST,
//   port: environment.EMAIL_PORT,
//   secure: environment.EMAIL_SECURE,
  auth: {
    user: environment.EMAIL_USER,
    pass: environment.EMAIL_PASSWORD,
  },
});

