// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // 1) 이메일로 유저 조회
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    // 2) 비밀번호 검증
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    // 3) JWT 토큰 생성
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    // 4) 결과 반환: token 필드에만 JWT 담기
    return {
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
      },
    };
  }
}
