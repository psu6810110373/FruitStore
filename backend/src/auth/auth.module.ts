// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // บอกว่าจะใช้ตาราง User
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY_NAJA', // ของจริงควรใช้ .env [cite: 18]
      signOptions: { expiresIn: '1h' }, // Token หมดอายุใน 1 ชม.
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}