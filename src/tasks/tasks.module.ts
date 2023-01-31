import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService, TaskRepository],
  controllers: [TasksController],
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
})
export class TasksModule {}
