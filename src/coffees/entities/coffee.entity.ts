import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

// по дэфолту таблица будет названа именем класса в lowercase, то есть 'coffee', если мы хотим назвать таблицу например 'coffees', нужно указать название в декораторе @Entity('coffees')
@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // было добавлено для примера генерации миграции из изменений в модели
  // @Column({ nullable: true })
  // description: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  @JoinTable()
  @ManyToMany(
    (type) => Flavor, // хз
    (flavor) => flavor.coffees, // ссылается на поле flavor.coffees
    { cascade: true }, // будет заполнять таблицу flavors соответствующими вкусами при создании сущности coffee (insert, update)
  )
  flavors: Flavor[];
}
