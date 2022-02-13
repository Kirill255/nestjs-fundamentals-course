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

  async createCoffee(body: any) {
    this.coffees.push(body);
    return body;
  }

  async updateCoffee(id: string, body: any) {
    const coffee = await this.getOneCoffee(id);
    if (!coffee) return {};
    const updatedCoffee = Object.assign({}, coffee, body);
    return updatedCoffee;
  }

  async removeCoffee(id: string) {
    const coffeeIndex = this.coffees.findIndex((c) => c.id === Number(id));
    if (coffeeIndex === -1) return {};
    const removedCoffee = this.coffees.splice(coffeeIndex, 1);
    return removedCoffee;
  }
}
