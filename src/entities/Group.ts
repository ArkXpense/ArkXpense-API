import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Expense } from './Expense';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  users!: User[];

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses!: Expense[];
}
