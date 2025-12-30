import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // ถ้า connect จากเครื่องตัวเองใช้ localhost
      port: 5432,
      username: 'myuser',      // ตรงกับ docker-compose.yml
      password: 'mypassword',  // ตรงกับ docker-compose.yml
      database: 'fruit_shop_db', // ตรงกับ docker-compose.yml
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // โหลด Entity อัตโนมัติ
      synchronize: true, // สำคัญ! Auto create table (ใช้เฉพาะตอน Dev)
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
