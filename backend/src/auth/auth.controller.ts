// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth') // เข้าถึงด้วย http://localhost:3000/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. API สมัครสมาชิก (POST /auth/register)
  @Post('/register')
  async register(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.register(authCredentialsDto.username, authCredentialsDto.password);
  }

  // 2. API เข้าสู่ระบบ (POST /auth/login)
  @Post('/login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(authCredentialsDto.username, authCredentialsDto.password);
  }
}