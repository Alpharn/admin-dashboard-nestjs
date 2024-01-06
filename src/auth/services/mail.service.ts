import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendPasswordResetMail(to: string, resetLink: string): Promise<void> {
    const username = to.split('@')[0];
    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to: to,
      subject: `Password Reset for ${username}`,
      html: `
        <div>
          <h1>Password Reset Request</h1>
          <p>To reset your password, please click the link below:</p>
          <a href="${resetLink}">Reset Password</a>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordChangeConfirmation(to: string): Promise<void> {
    const username = to.split('@')[0];
    const supportLink = 'https://c.tenor.com/y2JXkY1pXkwAAAAC/tenor.gif'
    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to: to,
      subject: `Password Changed Successfully for ${username}`,
      html: `
        <div>
          <h1>Password Changed</h1>
          <p>Your password has been successfully changed. If you did not initiate this change, please contact our support team immediately.</p>
          <a href="${supportLink}">Contact support</a>
        </div>
      `,
    };
  
    await this.transporter.sendMail(mailOptions);
  }
}