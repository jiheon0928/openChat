import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './DTO/register.dto';
import { LoginDto } from './DTO/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async signup(@Body() body: RegisterDto) {
    const { email, password, nickname } = body;

    const existUser = await this.userService.findByEmail(email);
    if (existUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const existNickName = await this.userService.findByNickname(nickname);
    if (existNickName) {
      throw new BadRequestException('이미 사용중인 닉네임 입니다.');
    }

    const newUser = await this.userService.createUser(
      email,
      password,
      nickname,
    );

    return {
      message: '회원가입 성공',
      result: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
      },
    };
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { email, password } = body;
    const { accessToken, nickname, id } = await this.authService.login(
      email,
      password,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 * 1000,
    });

    return res.status(200).json({
      message: '로그인 성공',
      result: {
        nickname,
        id,
      },
    });
  }
}
