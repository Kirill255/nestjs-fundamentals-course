import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { ASYNC_COFFEE_BRANDS, COFFEE_BRANDS } from './coffees.constants';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

// @Injectable() // как синглтон, то есть в одном экземпляре на всё приложение, может кэшироваться, в 95% кейсов используется именно синглтон
// @Injectable({ scope: Scope.DEFAULT }) // вроде это тоже самое, только явно указан параметр
@Injectable({ scope: Scope.REQUEST }) // инстанс создаётся на каждый запрос и после уничтожается
// @Injectable({ scope: Scope.TRANSIENT }) // создаётся по инстансу на каждый импортируемый модуль
export class CoffeesService {
  // private coffees: Coffee[] = [
  //   {
  //     id: 1,
  //     name: 'Shipwreck Roast',
  //     brand: 'Buddy Brew',
  //     flavors: ['chocolate', 'vanilla'],
  //   },
  // ];
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[], // теперь через переменную coffeeBrands мы имеем доступ к значению которое передали провайдеру COFFEE_BRANDS, а именно доступ к массиву ['buddy brew', 'nescafe']
    @Inject(ASYNC_COFFEE_BRANDS) asyncCoffeeBrands: string[],
    // private readonly configService: ConfigService,

    // A reasonable alternative is to inject the coffees namespace directly. This allows us to benefit from strong typing https://docs.nestjs.com/techniques/configuration#configuration-namespaces
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    // так как мы указали scope TRANSIENT, то консоль лог 'CoffeesService instantiated' будет вызван дважды, вернее сервис CoffeesService будет создан дважды, по разу для каждого импортируещего модуля, то есть для каждого импортируещего модуля будет создан своя выделенная копия сервиса
    console.log('CoffeesService instantiated');
    console.log(coffeeBrands);
    console.log(asyncCoffeeBrands);

    // const databaseHost = configService.get<string>('DATABASE_HOST');
    // console.log(databaseHost);

    // const databaseHost = configService.get<string>(
    //   'DATABASE_HOST',
    //   'localhost', // вторым аргументом можно передать значение по-умолчанию, если вдруг запрашиваемой переменной не будет в конфиге
    // );
    // console.log(databaseHost);

    // const databaseHost = configService.get<string>(
    //   'database.host',
    //   'localhost',
    // );
    // console.log(databaseHost);

    // сейчас ConfigModule в модуле CoffeesModule подключён в режиме forFeature
    // const coffeesConfig = configService.get('coffees');
    // console.log(coffeesConfig); // { foo: 'bar' }

    // const coffeesConfigFoo = configService.get('coffees.foo');
    // console.log(coffeesConfigFoo); // 'bar'

    console.log(coffeesConfiguration); // { foo: 'bar' }
    console.log(coffeesConfiguration.foo); // 'bar'
  }
  async getAllCoffees(paginationQueryDto: PaginationQueryDto) {
    const { offset, limit } = paginationQueryDto;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async getOneCoffee(id: string) {
    const coffee = await this.coffeeRepository.findOne(Number(id), {
      relations: ['flavors'],
    });
    if (!coffee) {
      // throw new HttpException(
      //   `Coffee with id ${id} not found`,
      //   HttpStatus.NOT_FOUND,
      // );
      throw new NotFoundException(`Coffee with id ${id} not found`);
    }
    return coffee;
  }

  async createCoffee(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    // тут пока не очень понял, сначала создаётся инстанс согласно описанию в модели, а потом сущность сохраняется в базу, возможно есть способ добавть в базу новую строку одним действием
    // TODO: тут нужен await?
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors, // тут заменили переданное в createCoffeeDto свойство flavors, на инстансы модели Flavor
    });
    return this.coffeeRepository.save(coffee);
  }

  async updateCoffee(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    // в отличии от CreateCoffeeDto, в updateCoffeeDto поле flavors необязательное, поэтому проверяем его наличие
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));
    // блять тут вообще не понял теперь, если в create методе мы типа создавали инстанс модели и потом его сохраняли в базу(save), то зачем тут save вызывается?
    // метод preload находит в базе сущность и если находит заменяет/обновляет все переданные свойства, если не находит, то возвращает undefined, зачем после save вызывается?
    const coffee = await this.coffeeRepository.preload({
      id: Number(id),
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee with id ${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async removeCoffee(id: string) {
    const coffee = await this.getOneCoffee(id);
    return this.coffeeRepository.remove(coffee);
  }

  // пример транзакции, но сама функция в данный момент нигде не используется
  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release(); // close queryRunner
    }
  }

  // преобразует строку переданную с клиента в тип Flavor, например передали flavors: ['chocolate'], 'chocolate' - просто строка, перед сохранением в базу преобразуем её к типу Flavor
  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
