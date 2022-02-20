import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(['name', 'type']) // составной индекс
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  // @Index() // добавление в индекс конкретного столбца
  @Column()
  type: string;

  // @Index('name-idx') // добавление в индекс конкретного столбца с указанием названия индекса
  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}
