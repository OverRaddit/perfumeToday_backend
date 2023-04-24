import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { CookieModule } from './cookie/cookie.module';
import { OtpModule } from './otp/otp.module';
import { MailModule } from './mail/mail.module';
import { ChatModule } from './chat/chat.module';
<<<<<<< HEAD
import { FriendlistModule } from './friendlist/friendlist.module';
=======
import { FriendlistModule } from './friendlist/friendlist.module';
>>>>>>> 0c730a6 (feat : Friend, BlackList CRUD)
import { UserblacklistModule } from './userblacklist/userblacklist.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    CookieModule,
    OtpModule,
    MailModule,
    ChatModule,
    FriendlistModule,
    UserblacklistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
