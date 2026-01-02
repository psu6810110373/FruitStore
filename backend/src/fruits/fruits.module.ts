import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FruitsController } from './fruits.controller';
import { FruitsService } from './fruits.service';
import { Fruit } from '../entities/fruit.entity';
import { AuthModule } from '../auth/auth.module'; // Import เพื่อใช้ Guard

@Module({
  imports: [
    TypeOrmModule.forFeature([Fruit]),
    AuthModule, 
  ],
  controllers: [FruitsController],
  providers: [FruitsService],
})
export class FruitsModule {}