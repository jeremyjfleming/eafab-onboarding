import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  require('dotenv').config()
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "eafab.digisignonline.com"
  })
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
