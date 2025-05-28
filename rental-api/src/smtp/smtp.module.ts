import { MailerModule } from "@nestjs-modules/mailer"
import { SMTPService } from "./smtp.service";
import { Module } from "@nestjs/common";
import { config } from "../.env"
import { SMTPController } from "./smtp.controller";


@Module({
    imports:[
    MailerModule.forRoot({
        transport: {
        host: process.env.EMAIL_HOST,
        auth: {
            user: config.USER,
            pass: config.PASS,
        },
        },
    })],
    providers: [SMTPService],
    controllers: [SMTPController],
})
export class SMTPModule{}


   