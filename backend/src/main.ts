import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './common/interceptors/tranfrom.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS: Vercel 배포 도메인만 허용
  app.use(
    cors({
      origin: ['https://open-chat-sandy.vercel.app', 'http://localhost:3000'],
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
