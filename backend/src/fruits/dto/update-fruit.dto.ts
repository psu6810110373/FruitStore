import { PartialType } from '@nestjs/mapped-types';
import { CreateFruitDto } from './create-fruit.dto';

export class UpdateFruitDto extends PartialType(CreateFruitDto) {}