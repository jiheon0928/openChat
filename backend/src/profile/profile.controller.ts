import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  // 로그인한 유저만 접근할 수 있도록 보호
  @UseGuards(JwtAuthGuard)
  @Get()
  getMyProfile(@Request() req) {
    // req.user는 jwt.strategy.ts의 validate() 함수에서 리턴한 값
    return {
      message: '내 정보입니다',
      user: req.user, // 예: { id: 1, email: 'test@example.com' }
    };
  }
}
