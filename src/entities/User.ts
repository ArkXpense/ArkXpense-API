import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Group } from './Group';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  walletAddress!: string;

  @ManyToMany(() => Group, (group) => group.users)
  groups!: Group[];
}
