// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './common/interceptors/tranfrom.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1) CORS 허용 origin 환경변수 처리
  const rawOrigins =
    process.env.CORS_ORIGIN?.trim() ||
    process.env.CLIENT_ORIGIN?.trim() ||
    '';
  const defaultOrigins = [
    'http://localhost:3000',
    'https://open-chat-sandy.vercel.app',
    'http://jiheonchat.duckdns.org:3000',
    'https://jiheonchat.duckdns.org',
  ];
  const allowedOrigins =
    rawOrigins === ''
      ? defaultOrigins
      : rawOrigins.split(',').map((o) => o.trim());

  console.log('🔐 Allowed CORS origins:', allowedOrigins);

  // 2) Express용 CORS 미들웨어 + preflight 핸들러
  const corsOptions = {
    origin: (origin: string | undefined, callback: any) => {
      // origin이 없으면 (postman 등) 허용, 아니면 리스트 체크
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    optionsSuccessStatus: 204,
  };
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // preflight

  // 3) Nest 방식 CORS (중복돼도 OK)
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

  // 4) ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 5) Cookie parser
  app.use(cookieParser());

  // 6) Transform interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // 7) Socket.IO adapter
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

  // 8) 포트 바인딩
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}

bootstrap();
