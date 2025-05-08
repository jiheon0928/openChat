import * as nodeCrypto from 'crypto';
(global as any).crypto = nodeCrypto;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './common/interceptors/tranfrom.intercoptor';

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

  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({ origin: true, credentials: true });

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
