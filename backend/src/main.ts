// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './common/interceptors/tranfrom.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 허용할 도메인 목록
  const origins = [
    'http://localhost:3000',
    'https://open-chat-sandy.vercel.app',
  ];

  // 1) CORS 설정: cookie 안 쓰니 credentials: false
  app.enableCors({
    origin: origins,
    credentials: false,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization', // Authorization 헤더 허용
      'X-Requested-With',
      'Accept',
    ],
  });

  // 2) DTO 유효성 검사
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3) 응답 변환 인터셉터
  app.useGlobalInterceptors(new TransformInterceptor());

  // 4) Socket.IO 설정: credentials false
  const ioAdapter = new IoAdapter(app);
  const server = app.getHttpServer() as any;
  ioAdapter.createIOServer(server, {
    cors: {
      origin: origins,
      methods: ['GET', 'POST'],
      credentials: false,
    },
  });
  app.useWebSocketAdapter(ioAdapter);

  // 5) 서버 시작
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}

bootstrap();
