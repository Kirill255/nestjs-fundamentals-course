import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import appConfig from './config/app.config';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.development.env', // по-дэфолту конфиг смотрит в корень проекта в файл .env, с помощью envFilePath можно изменить месторасположение и название файла из которого читать env переменные
      // envFilePath: ['.env.development.local', '.env.development'], // можно указать пути к нескольким конфигам, если переменная будет найдена в обоих конфигах, то приоритет будет за первым в списке конфигом
      // ignoreEnvFile: true, // игнорировать .env файл, например чтобы прокидывать значения переменных в рантайме, при запуске скриптов
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
      load: [appConfig],
    }),
    CoffeesModule,
    // пока не понял в чём разница, pg работает и так и так
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'testtesttest',
    //   database: 'nestjs-fundamentals-course',
    //   autoLoadEntities: true,
    //   synchronize: true,
    //   logging: true,
    // }),
    // пока не понял в чём разница, pg работает и так и так
    // кажется понял, переменные берутся из конфига(ConfigModule), который подгружает их из .env файла или какого-то кастомного конфига, дак вот в случае синхронного forRoot очень важен порядок импорта модулей
    // сначала конфиг, после TypeOrm, вот так imports: [ConfigModule, TypeOrmModule.forRoot]
    // если сделаем наоборот, вот так imports: [TypeOrmModule.forRoot, ConfigModule], то в нашем случае, база не сможет подключиться так как переменные будут ещё недоступны(undefined)
    // с forRootAsync порядок не имеет значения, всё будет подгружаться и инициализироваться нормально
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10), // по-умолчанию все значения из .env являются строками
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
    CoffeeRatingModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_PIPE, useClass: ValidationPipe }, // так можно зарегестрировать ValidationPipe на уровне модуля, в нашем случае AppModule, вместо глобального объявления на уровне всего приложения
  ],
})
export class AppModule {}
