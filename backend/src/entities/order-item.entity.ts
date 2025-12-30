// src/order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Fruit } from './fruit.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  // เชื่อมกับ Order (บิลไหน)
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  // เชื่อมกับ Fruit (ผลไม้อะไร)
  @ManyToOne(() => Fruit, (fruit) => fruit.orderItems)
  fruit: Fruit;

  @Column('int')
  quantity: number;

  @Column('int') // เก็บราคา ณ ตอนซื้อ
  price_at_purchase: number;
}
