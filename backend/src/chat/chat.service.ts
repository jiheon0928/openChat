import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ 과거 메세지 가져오기
  async findAll(): Promise<any[]> {
    const messages = await this.chatMessageRepository.find({
      relations: ['sender'],
      order: { createdAt: 'ASC' },
      take: 50,
    });

    return messages.map((message) => ({
      id: message.id,
      senderId: message.sender.id,
      nickname: message.sender.nickname,
      content: message.content,
      createdAt: message.createdAt,
    }));
  }

  // ✅ 새 메세지 저장하기
  async saveMessage(userId: number, content: string): Promise<ChatMessage> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const message = this.chatMessageRepository.create({
      sender: user,
      content,
    });

    return await this.chatMessageRepository.save(message);
  }
}
