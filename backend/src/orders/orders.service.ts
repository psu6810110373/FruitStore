import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fruit } from 'src/entities/fruit.entity';
import { Order, OrderStatus, } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from 'src/entities/order-item.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository : Repository<Order>,
        @InjectRepository(Fruit)
        private fruitRepository: Repository<Fruit>,
        private dataSource : DataSource,
    ) {}

    async create(user: User, createOrderDto : CreateOrderDto) : Promise<Order> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction(); //เริ่มเปิดบิล

        try {
            const order = new Order();     //สร้าง Order เปล่าๆตั้งไว้
            order.user = user ;
            order.status = OrderStatus.PENDING;
            order.total = 0;    //เซตค่าตอนแรกเป็น 0
            order.items = [];

            let calculatedTotal = 0;
            
            // 2. วนลูปสินค้าแต่ละตัวที่ลูกค้าสั่งมา
            for(const itemDto of createOrderDto.items) {
                // 2.1 ดึงข้อมูลผลไม้ล่าสุด (พร้อมล็อกแถวกันคนแย่งซื้อ)
                const fruit = await queryRunner.manager.findOne(Fruit, {
                    where : { id : itemDto.fruitId},
                    lock : { mode : 'pessimistic_write'}, // ล็อกไว้ ห้ามใครแก้จนกว่าฉันจะเสร็จ
                });

                if (!fruit) {
                    throw new NotFoundException(`Fruit ID ${itemDto.fruitId} not found`)
                }

                if (fruit.stock < itemDto.quantity) {
                    throw new BadRequestException(`Fruit ${fruit.name} is out of stock (only ${fruit.stock} left)`);
                }
                
                // 2.2 ตัดสต็อก
                fruit.stock -= itemDto.quantity;
                await queryRunner.manager.save(fruit);

                // 2.3 สร้างรายการย่อย (Item)
                const orderItem = new OrderItem();
                orderItem.fruit = fruit;
                orderItem.price_at_purchase = fruit.price; // บันทึกราคา ณ ตอนที่ซื้อ
                orderItem.quantity = itemDto.quantity;

                // เอาใส่ตะกร้าไว้ก่อน
                order.items.push(orderItem);
                calculatedTotal += fruit.price * itemDto.quantity;
            } 

            // 3.สรุปยอดเงินรวม
            order.total = calculatedTotal;

            // 4. บันทึก Order ใหญ่ลง Database
            const savedOrder = await queryRunner.manager.save(Order, order);
            
            // 5. บันทึกรายการย่อยๆ ตามลงไป
            for (const item of order.items) {
                item.order = savedOrder;
                await queryRunner.manager.save(OrderItem, item);
            }
            await queryRunner.commitTransaction(); //ยืนยันการสั่งซื้อ

            //ส่งช้อมูลกลับให้ลูกค้า
            return this.ordersRepository.findOneOrFail({
                where : { id: savedOrder.id },
                relations : ['items', 'items.fruit']
            });
        } catch (err) {
            //ถ้ามีปัญหา ยกเลิกที่ทำมา พร้อมคืนสต้อกเหมือนเดิม
            await queryRunner.rollbackTransaction();
            throw err ;
        } finally {
            await queryRunner.release();
        }
    }
    
   async findMyOrders(user: User): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: user.id } },
      relations: ['items', 'items.fruit'],
      order: { created_at: 'DESC' }, // ใหม่สุดขึ้นก่อน
    });
  }

  async uploadSlip(id: number, filename: string) {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException('ไม่พบออเดอร์นี้');
    }

    // อัปเดตข้อมูล
    order.slip_image = filename; // บันทึกชื่อไฟล์
    order.status = OrderStatus.WAITING_VERIFY; // เปลี่ยนสถานะเป็น "รอตรวจสอบ"

    return this.ordersRepository.save(order);
  }

  findAllOrdersForAdmin() {
    return this.ordersRepository.find({
      relations: {
        user: true, // ดึงข้อมูลคนสั่งมา
        items: {
          fruit: true,
        },
      },
      order: {
        id: 'DESC', // เรียงจากล่าสุดไปเก่า
      },
    });
  }

  async approveOrder(id: number) {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found');

    order.status = OrderStatus.COMPLETED; // เปลี่ยนสถานะเป็นเสร็จสิ้น
    return this.ordersRepository.save(order);
  }
}