import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins =
    process.env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()) ??
    [];
  app.enableCors({ origin: allowedOrigins });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(`Rooms Service running on: http://localhost:${port}`);
}
bootstrap();
