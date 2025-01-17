import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Group } from './Group';

@Entity('expenses')
export class Expense extends BaseEntity {
  @Column('float')
  amount!: number;

  @Column()
  description!: string;

  @ManyToOne(() => Group, (group) => group.expenses, { onDelete: 'CASCADE' })
  group!: Group;
}
