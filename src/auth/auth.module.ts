import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database.module';
import { MailModule } from 'src/mail/mail.module';
import { OtpModule } from 'src/otp/otp.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConfigModule } from 'src/jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UserModule,
    MailModule,
    OtpModule,
    JwtConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
