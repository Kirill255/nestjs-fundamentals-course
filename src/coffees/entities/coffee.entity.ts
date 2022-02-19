import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// по дэфолту таблица будет названа именем класса в lowercase, то есть 'coffee', если мы хотим назвать таблицу например 'coffees', нужно указать название в декораторе @Entity('coffees')
@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column('json', { nullable: true })
  flavors: string[];
}
