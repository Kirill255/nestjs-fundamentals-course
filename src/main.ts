import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // если с фронта передаются поля невключенные в описание типа, они не попадут в условный req.body(например, createCoffeeDto) в контроллере
      forbidNonWhitelisted: true, // если с фронта передаются поля невключенные в описание типа будет выбрасываться ошибка
    }),
  );
  await app.listen(3000);
}
bootstrap();
