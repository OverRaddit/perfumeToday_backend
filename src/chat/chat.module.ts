import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { chatProviders } from './chat.providers';
import { DatabaseModule } from 'src/database.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ChatController],
  providers: [ChatService, ...chatProviders],
  exports: [ChatService],
})
export class ChatModule {}
