// src/auth/auth.controller.ts
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth') // เข้าถึงด้วย http://localhost:3000/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.register(authCredentialsDto.username, authCredentialsDto.password);
  }

  @Post('/login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(authCredentialsDto.username, authCredentialsDto.password);
  }
}