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

  // 1) CORS 허용 origin 환경변수 (도커: CORS_ORIGIN, Vercel: CLIENT_ORIGIN) 읽기
  const rawOrigins = process.env.CORS_ORIGIN ?? process.env.CLIENT_ORIGIN;
  const allowedOrigins = rawOrigins
    ? rawOrigins.split(',').map((o) => o.trim())
    : [
        'http://localhost:3000',
        'https://open-chat-sandy.vercel.app',
      ];

  console.log('🔐 Allowed CORS origins:', allowedOrigins);

  // 2) CORS 설정
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

  // 3) 전역 유효성 검사 파이프
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 4) 쿠키 파서
  app.use(cookieParser());

  // 5) 응답 포맷 인터셉터
  app.useGlobalInterceptors(new TransformInterceptor());

  // 6) 0.0.0.0 바인딩 + 포트
  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}

bootstrap();
