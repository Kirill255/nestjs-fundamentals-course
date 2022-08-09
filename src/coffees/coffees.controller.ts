import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
  SetMetadata,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

// @UsePipes(ValidationPipe) // а так pipe регестрируется на уровне контроллера
// @UsePipes(new ValidationPipe({})) // если нужно передать какие-то специфичные настройки
@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    console.log('CoffeesController created');
    console.log(request.headers);
    console.log(request.cookies);
  }

  /**
   * GET http://localhost:3000/coffees?offset=10&limit=20
   * @param query
   * @returns
   */
  // @UsePipes(ValidationPipe) // регистрация pipe'а на уровне конкретного роута/хэндлера
  // @SetMetadata('isPublic', true) // вместо этого мы создали Public декоратор
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCoffees(@Query() paginationQueryDto: PaginationQueryDto) {
    const allCoffees = await this.coffeesService.getAllCoffees(
      paginationQueryDto,
    );
    return {
      handler: 'getAllCoffees',
      data: allCoffees,
      offset: paginationQueryDto.offset,
      limit: paginationQueryDto.limit,
    };
  }

  /**
   * GET http://localhost:3000/coffees/123
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOneCoffee(@Param('id') id: number) {
    // без transform: true в id приходит строка, но мы указали, что id должен быть числом
    // с transform: true, id автоматически трансформируется в ожидаемый нами тип
    console.log(typeof id);
    const coffee = await this.coffeesService.getOneCoffee(String(id));
    return {
      handler: 'getOneCoffee',
      data: coffee,
      id,
    };
  }

  /**
   * POST http://localhost:3000/coffees
   * @param body
   * @returns
   * {
   *  "id": 2,
   *  "name": "MacCoffee Latte Al Caramello",
   *  "brand": "MacCoffe",
   *  "flavor": ["caramel"],
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCoffee(@Body() createCoffeeDto: CreateCoffeeDto) {
    // без transform: true в ValidationPipe, объект createCoffeeDto похож на CreateCoffeeDto, но не является его экземпляром
    // с transform: true, объект createCoffeeDto полностью сообветствует типу CreateCoffeeDto и является его экземпляром
    console.log(createCoffeeDto instanceof CreateCoffeeDto);
    const newCoffee = await this.coffeesService.createCoffee(createCoffeeDto);
    return {
      handler: 'createCoffee',
      data: newCoffee,
      body: createCoffeeDto,
    };
  }

  /**
   * PATCH http://localhost:3000/coffees/123
   * @param id
   * @param body
   * @returns
   * {
   *  "name": "Espresso"
   * }
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCoffee(
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    const updatedCoffee = await this.coffeesService.updateCoffee(
      id,
      updateCoffeeDto,
    );
    return {
      handler: 'updateCoffee',
      data: updatedCoffee,
      id,
      body: updateCoffeeDto,
    };
  }

  /**
   * DELETE http://localhost:3000/coffees/123
   * @param id
   * @returns
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removeCoffee(@Param('id') id: string) {
    const removedCoffee = await this.coffeesService.removeCoffee(id);
    return {
      handler: 'removeCoffee',
      data: removedCoffee,
      id,
    };
  }

  /* 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  */

  /**
   * GET http://localhost:3000/coffees
   * @returns
   */
  // @Get()
  // getAllCoffees() {
  //   return {
  //     handler: 'getAllCoffees',
  //     data: {},
  //   };
  // }

  /**
   * GET http://localhost:3000/coffees
   * @returns
   */
  // @Get()
  // @HttpCode(200)
  // getAllCoffees() {
  //   return {
  //     handler: 'getAllCoffees',
  //     data: {},
  //   };
  // }

  /**
   * GET http://localhost:3000/coffees
   * @returns
   */
  // @Get()
  // @HttpCode(HttpStatus.OK)
  // getAllCoffees() {
  //   return {
  //     handler: 'getAllCoffees',
  //     data: {},
  //   };
  // }

  /**
   * GET http://localhost:3000/coffees
   * @returns
   */
  // @Get()
  // getAllCoffees(@Res() response) {
  //   response.status(200).json({
  //     handler: 'getAllCoffees',
  //     data: {},
  //   });
  // }

  /**
   * GET http://localhost:3000/coffees?offset=10&limit=20
   * @param query
   * @returns
   */
  // @Get()
  // getAllCoffees(@Query() query) {
  //   const { offset, limit } = query;
  //   return {
  //     handler: 'getAllCoffees',
  //     data: { offset, limit },
  //   };
  // }

  /**
   * GET http://localhost:3000/coffees/123
   * @param id
   * @returns
   */
  // @Get(':id')
  // getOneCoffee(@Param() params) {
  //   return {
  //     handler: 'getOneCoffee',
  //     data: { id: params.id },
  //   };
  // }

  /**
   * GET http://localhost:3000/coffees/123
   * @param id
   * @returns
   */
  // @Get(':id')
  // getOneCoffee(@Param('id') id: string) {
  //   return {
  //     handler: 'getOneCoffee',
  //     data: { id },
  //   };
  // }

  /**
   * POST http://localhost:3000/coffees
   * @param body
   * @returns
   * {
   *  "id": "123",
   *  "name": "MacCoffe"
   * }
   */
  // @Post()
  // createCoffee(@Body() body) {
  //   return {
  //     handler: 'createCoffee',
  //     data: { body },
  //   };
  // }

  /**
   * POST http://localhost:3000/coffees
   * @param body
   * @returns
   * {
   *  "id": "123",
   *  "name": "MacCoffe"
   * }
   */
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // createCoffee(@Body('name') name: string) {
  //   return {
  //     handler: 'createCoffee',
  //     data: { name },
  //   };
  // }

  /**
   * PATCH http://localhost:3000/coffees/123
   * @param id
   * @param body
   * @returns
   * {
   *  "name": "Espresso"
   * }
   */
  // @Patch(':id')
  // @HttpCode(HttpStatus.NO_CONTENT) // 204 успех, можно и 200 возвращать
  // updateCoffee(@Param('id') id: string, @Body() body) {
  //   return {
  //     handler: 'updateCoffee',
  //     data: { id, body },
  //   };
  // }

  /**
   * DELETE http://localhost:3000/coffees/123
   * @param id
   * @returns
   */
  // @Delete(':id')
  // @HttpCode(HttpStatus.OK)
  // removeCoffee(@Param('id') id: string) {
  //   return {
  //     handler: 'removeCoffee',
  //     data: { id },
  //   };
  // }

  /**
   * GET http://localhost:3000/coffees/top
   * @returns
   */
  // @Get('top')
  // getTopCoffees() {
  //   return {
  //     handler: 'getTopCoffees',
  //     data: {},
  //   };
  // }
}
