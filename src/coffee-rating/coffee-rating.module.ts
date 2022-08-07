import { Module } from '@nestjs/common';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { DatabaseModule } from 'src/database/database.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
  // imports: [CoffeesModule], // там как в модуле CoffeeRatingModule, а точнее в его сервисе CoffeeRatingService предполагается использование сервиса CoffeesService, то мы импортируем сюда модуль CoffeesModule, но также необходимо в самом модуле CoffeesModule сначала экспортировать сервис CoffeesService
  imports: [
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'testtesttest',
    }),
    CoffeesModule,
  ],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
