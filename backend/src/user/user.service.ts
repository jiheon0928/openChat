// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(
    email: string,
    password: string,
    nickname: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepo.create({
      email,
      password: hashedPassword,
      nickname,
    });

    return this.userRepo.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByNickname(nickname: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { nickname } });
  }
}
