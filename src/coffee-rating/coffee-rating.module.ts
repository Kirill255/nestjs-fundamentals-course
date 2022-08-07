import { Module } from '@nestjs/common';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
  imports: [CoffeesModule], // там как в модуле CoffeeRatingModule, а точнее в его сервисе CoffeeRatingService предполагается использование сервиса CoffeesService, то мы импортируем сюда модуль CoffeesModule, но также необходимо в самом модуле CoffeesModule сначала экспортировать сервис CoffeesService
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
