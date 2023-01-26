import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService, TaskRepository],
  controllers: [TasksController],
  imports: [TypeOrmModule.forFeature([Task])],
})
export class TasksModule {}
