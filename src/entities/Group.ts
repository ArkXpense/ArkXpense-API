import { Entity, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './BaseEntity'; 
import { User } from './User';
import { Expense } from './Expense';

@Entity('groups')
export class Group extends BaseEntity {
  @Column()
  name!: string;

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  users!: User[];

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses!: Expense[];
}
