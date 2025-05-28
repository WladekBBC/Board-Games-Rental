import { Controller, Get, Res } from '@nestjs/common';
import { SMTPService } from './smtp.service';

@Controller()
export class SMTPController {
  constructor(private readonly appService: SMTPService) {}

  @Get()
  sendMailer(@Res() response: any) {
    const mail = this.appService.sendMail();

    return response.status(200).json({
      message: 'success',
      mail,
    });
  }
}