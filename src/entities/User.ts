import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Group } from './Group';
import { Expense } from './Expense';
import { Income } from './Income';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  walletAddress!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ nullable: true })
  nickname!: string;

  @ManyToMany(() => Group, (group) => group.users) 
  groups!: Group[];

  @OneToMany(() => Expense, (expense) => expense.user) 
  expenses!: Expense[];

  @OneToMany(() => Income, (income) => income.receiver) 
  incomes!: Income[]; 
}