// src/user/user.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * 이메일로 유저 조회
   * @param email 조회할 유저의 이메일
   * @returns User 엔티티 또는 예외
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`유저(${email})를 찾을 수 없습니다.`);
    }
    return user;
  }

  /**
   * 새 유저 생성
   * @param nickname 닉네임
   * @param email 이메일
   * @param password 평문 비밀번호
   * @returns 저장된 User 엔티티
   */
  async create(
    nickname: string,
    email: string,
    password: string,
  ): Promise<User> {
    // 비밀번호 해시
    const hashed = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      nickname,
      email,
      password: hashed,
    });
    return this.userRepo.save(user);
  }

  /**
   * 모든 유저 조회 (예: 관리자용)
   * @returns User 엔티티 배열
   */
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  /**
   * ID로 유저 조회
   * @param id 조회할 유저의 ID
   * @returns User 엔티티 또는 예외
   */
  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`유저(ID: ${id})를 찾을 수 없습니다.`);
    }
    return user;
  }

  /**
   * 유저 정보 업데이트
   * @param id 업데이트할 유저 ID
   * @param attrs 변경할 속성들
   * @returns 업데이트된 User 엔티티
   */
  async update(
    id: number,
    attrs: Partial<Pick<User, 'nickname' | 'email' | 'password'>>,
  ): Promise<User> {
    const user = await this.findById(id);

    if (attrs.password) {
      attrs.password = await bcrypt.hash(attrs.password, 10);
    }

    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }

  /**
   * 유저 삭제
   * @param id 삭제할 유저 ID
   */
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepo.remove(user);
  }
}
