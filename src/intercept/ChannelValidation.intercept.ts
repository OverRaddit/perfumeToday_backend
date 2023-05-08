// channel-validation.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChannelValidationInterceptor implements NestInterceptor {
  constructor(
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const data = context.switchToWs().getData();
    const { userId, roomName } = data;

    if (userId === undefined || roomName === undefined) {
      throw new BadRequestException(
        'Parameter error: userId and roomName are required.',
      );
    }
    const client = context.switchToWs().getClient();
    const socketUserId: number = parseInt(
      client?.handshake?.headers?.userid,
      10,
    );

    if (!client.rooms.has(roomName)) {
      throw new BadRequestException(
        `Error: ${roomName} does not exist among the channels the client joined.`,
      );
    }

    const channel = await this.chatService.getChannelByName(roomName);
    if (channel === null)
      throw new BadRequestException(`Error: Unknown channel ${roomName}`);
    const user = await this.userService.findUserById(userId);
    if (user === null) throw new BadRequestException(`Error: Unknown user.`);
    const clientUser = await this.userService.findUserById(socketUserId);
    if (clientUser === null) {
      throw new BadRequestException(`Error: Unknown user.`);
    }

    data.user = user;
    data.channel = channel;
    data.clientUser = clientUser;
    return next.handle();
  }
}
