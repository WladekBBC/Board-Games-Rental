import { Injectable } from '@nestjs/common';
import { config } from '../.env'  
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SMTPService {
  constructor(private readonly mailService: MailerService) {}

  sendMail() {
    const message = `Forgot your password? If you didn't forget your password, please ignore this email!`;

    this.mailService.sendMail({
      from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
      to: 'joanna@gmail.com',
      subject: `How to Send Emails with Nodemailer`,
      text: message,
    });
  }
}