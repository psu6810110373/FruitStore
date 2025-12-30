// src/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

// Enum สำหรับ Role ตามโจทย์ 
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Username ห้ามซ้ำ
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Relation: 1 User มีได้หลาย Order
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}