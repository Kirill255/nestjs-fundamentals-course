import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';

class MockCoffeesService {}

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
  providers: [
    {
      provide: CoffeesService,
      useValue: new MockCoffeesService(), // теперь все кто импортит к себе CoffeesService, будет получать экземпляр класса MockCoffeesService
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
