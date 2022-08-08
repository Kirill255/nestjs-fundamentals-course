import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.development.env', // по-дэфолту конфиг смотрит в корень проекта в файл .env, с помощью envFilePath можно изменить месторасположение и название файла из которого читать env переменные
      // envFilePath: ['.env.development.local', '.env.development'], // можно указать пути к нескольким конфигам, если переменная будет найдена в обоих конфигах, то приоритет будет за первым в списке конфигом
      // ignoreEnvFile: true, // игнорировать .env файл, например чтобы прокидывать значения переменных в рантайме, при запуске скриптов
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
  providers: [AppService],
})
export class AppModule {}
