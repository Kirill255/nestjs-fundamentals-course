import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // если с фронта передаются поля невключенные в описание типа, они не попадут в условный req.body(например, createCoffeeDto) в контроллере
      forbidNonWhitelisted: true, // если с фронта передаются поля невключенные в описание типа будет выбрасываться ошибка
      transform: true, // автоматически трансформирует входящие данные в тип данных описанный в котроллере
      transformOptions: {
        // кароче не понял что именно дополняется, почему недостаточно только 'transform: true', в описании написано вот так 'If set to true class-transformer will attempt conversion based on TS reflected type'
        // и вот так transform: true automatically transform payloads to be objects typed according to their DTO classes
        // при этом в async getOneCoffee(@Param('id') id: number) автоматом приводится к числу и БЕЗ transformOptions.enableImplicitConversion = true
        // а в async getAllCoffees(@Query() paginationQueryDto: PaginationQueryDto), параметры из PaginationQueryDto не приводятся к описанному типу limit и offset are numbers, нужно указывать настройку или явно трансформить при валидации к числу в dto файле, @Type(() => Number)
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalGuards(new ApiKeyGuard()); // теперь мы не можем зарегестрировать ApiKeyGuard глобально через useGlobalGuards, так как теперь в ApiKeyGuard используется DI, то есть в конструкторе этого класса мы импортируем пару зависимостей, поэтому мы всё инкапсулировали в модуль CommonModule, который добавили в AppModule, по сути ApiKeyGuard доступен также по всему приложению
  await app.listen(3000);
}
bootstrap();
