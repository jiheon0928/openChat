// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './common/interceptors/tranfrom.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1) CORS 허용 origin 환경변수 (도커: CORS_ORIGIN, Vercel: CLIENT_ORIGIN)
  //    기본값 ''을 붙여서 항상 string으로 만들어 줌
  const rawOrigins: string =
    process.env.CORS_ORIGIN ?? process.env.CLIENT_ORIGIN ?? '';

  // 2) 기본 origin 배열
  const defaultOrigins = [
    'http://localhost:3000',
    'https://open-chat-sandy.vercel.app',
  ];

  // 3) rawOrigins가 빈 문자열이면 기본, 아니면 split
  const allowedOrigins: string[] =
    rawOrigins.trim() === ''
      ? defaultOrigins
      : rawOrigins.split(',').map((o) => o.trim());

  console.log('🔐 Allowed CORS origins:', allowedOrigins);

  // 4) CORS 설정
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
      ],
      optionsSuccessStatus: 204,
    }),
  );

  // 5) 전역 유효성 검사 파이프
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 6) 쿠키 파서
  app.use(cookieParser());

  // 7) 응답 포맷 인터셉터
  app.useGlobalInterceptors(new TransformInterceptor());

  // 8) 포트 읽기 (undefined 방지)
  const port: number = parseInt(process.env.PORT ?? '3000', 10);

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}

bootstrap();
