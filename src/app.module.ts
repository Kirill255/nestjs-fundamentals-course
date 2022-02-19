import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
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
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'testtesttest',
        database: 'nestjs-fundamentals-course',
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
