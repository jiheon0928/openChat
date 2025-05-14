// src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string,
  ) {
    // 닉네임/이메일 중복 체크
    const existEmail = await this.userService.findByEmail(email);
    const existNickname = await this.userService.findByNickname(nickname);
    if (existEmail || existNickname) {
      throw new Error('이미 사용 중인 이메일 또는 닉네임입니다.');
    }
    // 회원 생성
    const newUser = await this.userService.createUser(
      email,
      password,
      nickname,
    );
    return {
      status: 'ok',
      message: '등록 성공',
      data: newUser,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    // 로그인 검증과 JWT 발급
    const token = await this.authService.login(email, password);
    return {
      status: 'ok',
      message: '로그인 성공',
      token, // 응답 바디에 JWT 토큰 포함
    };
  }
}
