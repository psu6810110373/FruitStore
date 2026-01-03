import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { Fruit } from 'src/entities/fruit.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Fruit]),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
