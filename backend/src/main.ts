// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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
  app.enableCors({
    origin: 'http://localhost:3000', // 프론트엔드 주소
    credentials: true, // 필요 시 쿠키 허용
  });
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3001);
}
bootstrap();
