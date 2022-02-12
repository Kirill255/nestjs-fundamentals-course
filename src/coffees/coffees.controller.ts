import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
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
  @Get()
  getAllCoffees(@Query() query) {
    const { offset, limit } = query;
    return {
      handler: 'getAllCoffees',
      data: { offset, limit },
    };
  }

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
  @Get(':id')
  getOneCoffee(@Param('id') id: string) {
    return {
      handler: 'getOneCoffee',
      data: { id },
    };
  }

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
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCoffee(@Body('name') name: string) {
    return {
      handler: 'createCoffee',
      data: { name },
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
  @HttpCode(HttpStatus.NO_CONTENT) // 204 успех, можно и 200 возвращать
  updateCoffee(@Param('id') id: string, @Body() body) {
    return {
      handler: 'updateCoffee',
      data: { id, body },
    };
  }

  /**
   * DELETE http://localhost:3000/coffees/123
   * @param id
   * @returns
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  removeCoffee(@Param('id') id: string) {
    return {
      handler: 'removeCoffee',
      data: { id },
    };
  }

  /**
   * GET http://localhost:3000/coffees/top
   * @returns
   */
  @Get('top')
  getTopCoffees() {
    return {
      handler: 'getTopCoffees',
      data: {},
    };
  }
}
