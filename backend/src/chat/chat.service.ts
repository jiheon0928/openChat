import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/user/user.entity';
import { ChatMessage } from './chatMessage.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 메세지 저장
   * @param userId
   * @param content 메세지 내용
   */
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

    return this.chatMessageRepository.save(message);
  }

  async getRecentMessages(limit = 50): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
