import { Controller, Get, Post, Body, Delete, Param, UseGuards, Patch } from '@nestjs/common';
import { FruitsService } from './fruits.service';
import { CreateFruitDto } from './dto/create-fruit.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { UpdateFruitDto } from './dto/update-fruit.dto';

@Controller('fruits')
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class FruitsController {
  constructor(private readonly fruitsService: FruitsService) {}

  @Get()
  findAll() {
    return this.fruitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id : string){
    return this.fruitsService.findOne(+id);
  }

  @Post()
  @Roles(UserRole.ADMIN) // แปะป้ายห้ามเข้า
  create(@Body() createFruitDto: CreateFruitDto) {
    return this.fruitsService.create(createFruitDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id : string, @Body() updateFruitDto: UpdateFruitDto) {
    return this.fruitsService.update(+id, updateFruitDto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // แปะป้ายห้ามเข้า
  remove(@Param('id') id: string) {
    return this.fruitsService.remove(+id);
  }
}