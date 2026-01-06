import { Controller, Get, Post, Body, UseGuards, UseInterceptors, Param, UploadedFile, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from '../entities/user.entity';
import { Roles } from 'src/auth/roles.decorator';

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

  // API ดึงออเดอร์ทั้งหมด (เฉพาะ Admin)
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllOrders() {
    return this.ordersService.findAllOrdersForAdmin();
  }

  // 👑 2. API อนุมัติออเดอร์ (เฉพาะ Admin)
  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  approveOrder(@Param('id') id: string) {
    return this.ordersService.approveOrder(+id);
  }

  //ส่งรูปอะพสลิปได้ Users
  @Post(':id/upload-slip')
  @UseGuards(AuthGuard('jwt')) // ต้อง Login ก่อนถึงจะส่งรูปได้
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // เก็บไฟล์ไว้ที่โฟลเดอร์ uploads
      filename: (req, file, callback) => {
        // ตั้งชื่อไฟล์ใหม่: สุ่มตัวเลข + นามสกุลไฟล์เดิม (เช่น .jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  }))
  uploadSlip(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    // ส่งชื่อไฟล์ที่เพิ่งเซฟเสร็จ ไปให้ Service อัปเดต Database
    return this.ordersService.uploadSlip(+id, file.filename);
  }
}