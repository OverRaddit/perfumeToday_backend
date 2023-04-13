import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { CookieModule } from './cookie/cookie.module';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule, CookieModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
