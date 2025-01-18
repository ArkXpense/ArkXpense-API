import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Group } from './entities/Group';
import { Expense } from './entities/Expense';
import { Income } from './entities/Income';
import dotenv from "dotenv"

dotenv.config()
console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true, // Cambia a false en producción
  logging: true,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  entities: [User, Group, Expense,Income],
});
