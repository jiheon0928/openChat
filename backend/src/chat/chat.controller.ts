import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async findAll(): Promise<{ result: any[] }> {
    const messages = await this.chatService.findAll();
    console.log('서버가 내려줄 messages:', messages);
    return { result: messages };
  }
}
