import { Injectable, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS, ASYNC_COFFEE_BRANDS } from './coffees.constants';
import { Connection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

// class MockCoffeesService {}

class ConfigService {}
class DevConfigService {}
class ProdConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return ['buddy brew', 'nescafe', 'maccoffee'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule],
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
    // { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] }, // провайдер, не основанный на классах, в данном примере мы используем строку 'COFFEE_BRANDS', чтобы заинжектить такой провайдер нужно использовать декоратор @Inject(), пример @Inject('COFFEE_BRANDS') coffeeBrands: string[],
    // { provide: COFFEE_BRANDS, useFactory: () => ['buddy brew', 'nescafe'] },

    CoffeeBrandsFactory, // зачем ещё раз отдельно регестрировать фабрику как провайдера, если мы это сделали используя расширенный синтексис, строчками ниже??? непонятно!
    {
      provide: COFFEE_BRANDS,
      useFactory: (brandsFactory: CoffeeBrandsFactory) =>
        brandsFactory.create(),
      inject: [CoffeeBrandsFactory], // в inject указываем класс, который будет передан в useFactory, при этом для чего-то этот класс нужно отдельно указывать в качестве провайдера, см выше
      // scope: Scope.TRANSIENT, // scope также можно указать в кастомном провайдере
    },

    {
      provide: ASYNC_COFFEE_BRANDS,
      useFactory: async (connection: Connection) => {
        console.log('async factory');
        // const coffeeBrands = await connection.query(`SELECT * FROM ...`);
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        return coffeeBrands;
      },
      inject: [Connection],
    },
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
