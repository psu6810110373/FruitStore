// src/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, Or } from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity'
;

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Relation: Order นี้เป็นของ User คนไหน
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({                 //คอลัมน์ status โดยใช้ Enum ที่สร้างไว้
    type: 'enum',
    enum: OrderStatus,
    default : OrderStatus.PENDING,
  })
  status : OrderStatus;

  @Column('decimal', { precision: 10, scale: 2})
  total: number;

  @CreateDateColumn()
  created_at: Date;

  // Relation: Order นี้มีรายการสินค้าอะไรบ้าง
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];
}