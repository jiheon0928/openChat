import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages() {
    const messages = await this.chatService.getRecentMessages(50);
    return {
      message: '최근 메세지 가져오기 성공',
      result: messages,
    };
  }
}
