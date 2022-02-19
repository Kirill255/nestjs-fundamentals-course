import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

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
  ) {}
  async getAllCoffees(offset: string | number, limit: string | number) {
    return this.coffeeRepository.find({ relations: ['flavors'] });
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
    // тут пока не очень понял, сначала создаётся инстанс согласно описанию в модели, а потом сущность сохраняется в базу, возможно есть способ добавть в базу новую строку одним действием
    // TODO: тут нужен await?
    const coffee = this.coffeeRepository.create(createCoffeeDto);
    return this.coffeeRepository.save(coffee);
  }

  async updateCoffee(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    // блять тут вообще не понял теперь, если в create методе мы типа создавали инстанс модели и потом его сохраняли в базу(save), то зачем тут save вызывается?
    // метод preload находит в базе сущность и если находит заменяет/обновляет все переданные свойства, если не находит, то возвращает undefined, зачем после save вызывается?
    const coffee = await this.coffeeRepository.preload({
      id: Number(id),
      ...updateCoffeeDto,
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
}
