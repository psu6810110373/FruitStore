// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 1. เพิ่ม UserRole เข้าไปใน import
import { User, UserRole } from '../entities/user.entity'; 
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = '1234'

    let role = UserRole.USER
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        role = UserRole.ADMIN;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      // 2. แก้ตรงนี้! จาก 'USER' เป็น UserRole.USER
      role: role, 
    });

    return this.usersRepository.save(user);
  }

  async login(username: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}