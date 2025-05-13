// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './common/interceptors/tranfrom.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1) CORS 허용 origin 환경변수
  const rawOrigins: string =
    process.env.CORS_ORIGIN ?? process.env.CLIENT_ORIGIN ?? '';

  // 2) 기본 origin 배열
  const defaultOrigins = [
    'http://localhost:3000',
    'https://open-chat-sandy.vercel.app',
    'http://jiheonchat.duckdns.org:3000',
    'https://jiheonchat.duckdns.org',
  ];

  // 3) rawOrigins 처리
  const allowedOrigins: string[] =
    rawOrigins.trim() === ''
      ? defaultOrigins
      : rawOrigins.split(',').map((o) => o.trim());

  console.log('🔐 Allowed CORS origins:', allowedOrigins);

  // ✅ 4) Nest 방식의 CORS 설정만 사용
  app.enableCors({
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
  });

  // 5) 글로벌 ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 6) 쿠키 파서
  app.use(cookieParser());

  // 7) 응답 인터셉터
  app.useGlobalInterceptors(new TransformInterceptor());

  // 8) Socket.IO adapter 설정
  const ioAdapter = new IoAdapter(app);
  const httpServer = app.getHttpServer() as any;
  ioAdapter.createIOServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  app.useWebSocketAdapter(ioAdapter);

  // 9) 포트 설정 및 서버 실행
  const port: number = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}

bootstrap();
