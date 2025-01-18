import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';

@Entity('incomes')
export class Income extends BaseEntity {
  @Column('float')
  amount!: number;

  @Column()
  description!: string;

  @ManyToOne(() => User, (user) => user.incomes) 
  receiver!: User; 

  
}