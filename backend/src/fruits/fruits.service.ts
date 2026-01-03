import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fruit } from '../entities/fruit.entity';
import { CreateFruitDto } from './dto/create-fruit.dto';
import { UpdateFruitDto } from './dto/update-fruit.dto';

@Injectable()
export class FruitsService {
  constructor(
    @InjectRepository(Fruit)
    private fruitsRepository: Repository<Fruit>,
  ) {}

  // ดึงผลไม้ทั้งหมด (สำหรับ User/Admin)
  async findAll(): Promise<Fruit[]> {
    return this.fruitsRepository.find();
  }

  //ดึงผลไม้แค่อันเดียว ได้ทั้ง User,Admin
  async findOne(id: number): Promise<Fruit> {
    const fruit = await this.fruitsRepository.findOne({ where: { id } });
    if (!fruit) {
      throw new NotFoundException(`Fruit with ID ${id} not found`);
    }
    return fruit;
  }

  // เพิ่มผลไม้ (สำหรับ Admin)
  async create(createFruitDto: CreateFruitDto): Promise<Fruit> {
    const fruit = this.fruitsRepository.create(createFruitDto);
    return this.fruitsRepository.save(fruit);
  }

  //อัพเดตผลไม่ ของแอดมิน
  async update(id:number, updateFruitDto : UpdateFruitDto): Promise<Fruit> {
    const fruit = await this.fruitsRepository.findOne({where: {id}});
    if (!fruit) {
      throw new NotFoundException(`Fruit with ID ${id} not found`);
    }
    Object.assign(fruit,updateFruitDto);
    return this.fruitsRepository.save(fruit);
  }

  // ลบผลไม้ (สำหรับ Admin)
  async remove(id: number): Promise<void> {
    const result = await this.fruitsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fruit with ID ${id} not found`);
    }
  }
}