import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];
  async getAllCoffees(offset: string | number, limit: string | number) {
    return this.coffees;
  }

  async getOneCoffee(id: string) {
    const coffee = this.coffees.find((c) => c.id === Number(id));
    if (!coffee) {
      // throw new HttpException(
      //   `Coffee with id ${id} not found`,
      //   HttpStatus.NOT_FOUND,
      // );
      throw new NotFoundException(`Coffee with id ${id} not found`);
    }
    return coffee;
  }

  async createCoffee(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
    return createCoffeeDto;
  }

  async updateCoffee(id: string, updateCoffeeDto: any) {
    const coffee = await this.getOneCoffee(id);
    if (!coffee) return {};
    const updatedCoffee = Object.assign({}, coffee, updateCoffeeDto);
    return updatedCoffee;
  }

  async removeCoffee(id: string) {
    const coffeeIndex = this.coffees.findIndex((c) => c.id === Number(id));
    if (coffeeIndex === -1) return {};
    const removedCoffee = this.coffees.splice(coffeeIndex, 1);
    return removedCoffee;
  }
}
