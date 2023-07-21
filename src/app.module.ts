import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { UserModule } from './user/user.module';
import { CookieModule } from './cookie/cookie.module';
import { OtpModule } from './otp/otp.module';
import { MailModule } from './mail/mail.module';
import * as fs from 'fs';
import { UploadsModule } from './uploads/uploads.module';
import UploadsService from './uploads/uploads.service';
import { UserService } from './user/user.service';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    // CookieModule,
    // OtpModule,
    // MailModule,
    // ChatModule,
    // FriendlistModule,
    // UserblacklistModule,
    // MatchhistoryModule,
    UploadsModule,
    ProductModule,
    PaymentModule,
    // UserstatusModule,
  ],
  controllers: [AppController],
  providers: [AppService, UploadsService, UserService],
})
export class AppModule {
  constructor() {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  }
}
