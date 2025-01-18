import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Group } from './Group';
import { User } from './User';

@Entity('expenses')
export class Expense extends BaseEntity {
  @Column('float')
  amount!: number; 

  @Column()
  description!: string; 

  @ManyToOne(() => Group, (group) => group.expenses) 
  group!: Group; 

  @ManyToOne(() => User, (user) => user.expenses) 
  payer!: User; 
}