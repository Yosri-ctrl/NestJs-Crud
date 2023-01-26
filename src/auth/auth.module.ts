import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { User } from './user.entity';

@Module({
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
