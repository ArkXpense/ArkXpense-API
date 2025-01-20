import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Group } from './Group';
import { User } from './User';

@Entity('expenses')
export class Expense extends BaseEntity {
  @Column('float',{ nullable: false })
  amount!: number; 

  @Column()
  description!: string; 

  @ManyToOne(() => Group, (group) => group.expenses,{ nullable: false }) 
  group!: Group; 

  @ManyToOne(() => User, (user) => user.expenses,{ nullable: false }) 
  user!: User; 

  @ManyToOne(() => User, (user) => user.guaranteedExpenses,{ nullable: false }) 
  guarantor!: User;
}