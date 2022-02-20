import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  // поле необязательное, проверяется что значение > 0
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}
