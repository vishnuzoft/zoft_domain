import { environment, transporter } from "../config";


export async function sendResetPasswordEmail(email: string, resetUrl: string): Promise<void> {
    const mailOptions = {
      from: environment.EMAIL_FROM, 
      to: email,
      subject: 'Reset Password',
      text: `Click on the link to reset your password: ${resetUrl}`,
      html: `<p>Click on the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
    }
  }
  