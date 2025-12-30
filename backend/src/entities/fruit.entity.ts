// src/fruit.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Fruit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  price: number;

  @Column('int') // สำคัญมาก! ใช้สำหรับ Logic ตัดสต็อก 
  stock: number;

  // Relation: 1 Fruit อยู่ในหลาย OrderItem ได้
  @OneToMany(() => OrderItem, (orderItem) => orderItem.fruit)
  orderItems: OrderItem[];
}