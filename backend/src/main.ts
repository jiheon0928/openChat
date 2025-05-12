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

  // CORS 허용 도메인 세팅
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') ?? [
    'http://localhost:3000',
    'https://open-chat-sandy.vercel.app',
  ];

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

  // 전역 유효성 검사
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 쿠키 파서
  app.use(cookieParser());

  // 공통 응답 포맷 인터셉터
  app.useGlobalInterceptors(new TransformInterceptor());

  // 0.0.0.0 바인딩으로 외부에서 접근 가능하도록 설정
  const port = (process.env.PORT, 10) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}

bootstrap();
