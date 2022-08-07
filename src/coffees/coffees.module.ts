import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';

// class MockCoffeesService {}

class ConfigService {}
class DevConfigService {}
class ProdConfigService {}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  // providers: [CoffeesService], // short syntax
  // providers: [
  //   {
  //     provide: CoffeesService,
  //     useClass: CoffeesService,
  //   },
  // ],
  // providers: [
  //   {
  //     provide: CoffeesService,
  //     useValue: new MockCoffeesService(), // теперь все кто импортит к себе CoffeesService, будет получать экземпляр класса MockCoffeesService
  //   },
  // ],
  providers: [
    CoffeesService,
    { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] }, // провайдер, не основанный на классах, в данном примере мы используем строку 'COFFEE_BRANDS', чтобы заинжектить такой провайдер нужно использовать декоратор @Inject(), пример @Inject('COFFEE_BRANDS') coffeeBrands: string[],
    {
      provide: ConfigService,
      useValue:
        process.env.NODE_ENV === 'production'
          ? ProdConfigService
          : DevConfigService,
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
