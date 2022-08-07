import { Injectable } from '@nestjs/common';
import { CoffeesService } from 'src/coffees/coffees.service';

@Injectable()
export class CoffeeRatingService {
  constructor(
    // также необходимо имортировать CoffeesModule в CoffeeRatingModule, чтобы использовать в этом сервисе сервис CoffeesService, и экспортировать CoffeesService в модуле CoffeesModule
    private readonly coffeesService: CoffeesService,
  ) {}
}
