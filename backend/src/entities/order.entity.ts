// src/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity'
;

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Relation: Order นี้เป็นของ User คนไหน
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column('int')
  total_price: number;

  @CreateDateColumn()
  created_at: Date;

  // Relation: Order นี้มีรายการสินค้าอะไรบ้าง
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];
}