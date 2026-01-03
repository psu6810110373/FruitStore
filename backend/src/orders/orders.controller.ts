import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../entities/user.entity';

@Controller('orders')
@UseGuards(AuthGuard('jwt')) // ต้องล็อกอินเท่านั้น
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // สั่งซื้อสินค้า
  @Post()
  create(@GetUser() user: User, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(user, createOrderDto);
  }

  // ดูประวัติการสั่งซื้อของฉัน
  @Get()
  findMyOrders(@GetUser() user: User) {
    return this.ordersService.findMyOrders(user);
  }
}