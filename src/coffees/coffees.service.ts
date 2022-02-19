import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
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
  ) {}
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

  // преобразует строку переданную с клиента в тип Flavor, например передали flavors: ['chocolate'], 'chocolate' - просто строка, перед сохранением в базу преобразуем её к типу Flavor
  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
