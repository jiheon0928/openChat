import * as nodeCrypto from 'crypto';
(global as any).crypto = nodeCrypto;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './common/interceptors/tranfrom.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  // CORS: 모든 Origin, 메서드, 헤더, 자격증명 허용
  app.enableCors({
    origin: true, // 요청한 모든 Origin 허용
    credentials: true, // 쿠키/인증 헤더 허용
    methods: '*', // 모든 HTTP 메서드 허용
    allowedHeaders: '*', // 모든 헤더 허용
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
