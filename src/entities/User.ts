import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Group } from './Group';
import { Expense } from './Expense';

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

  @OneToMany(() => Expense, (expense) => expense.payer) 
  expenses!: Expense[];
}