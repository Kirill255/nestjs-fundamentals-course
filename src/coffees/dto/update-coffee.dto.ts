import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDto } from './create-coffee.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}

/* 
для UpdateCoffeeDto наследуем описание типов из CreateCoffeeDto, но при этом при помощи PartialType, делаем все поля необязательными
Это выглядело бы примерно вот так

export class UpdateCoffeeDto {
  @IsString()
  readonly name?: string;
  @IsString()
  readonly brand?: string;
  @IsString({ each: true })
  readonly flavors?: string[];
}
*/
