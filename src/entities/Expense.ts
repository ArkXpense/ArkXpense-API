import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Group } from './Group';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('float')
  amount!: number;

  @Column()
  description!: string;

  @ManyToOne(() => Group, (group) => group.expenses, { onDelete: 'CASCADE' })
  group!: Group;
}
