import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { taskStatus } from './task-status.enum';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getAllTasks(filterDto, user);
  }

  getTaskById(id: string, user: User): Promise<Task> {
    return this.taskRepository.getTaskById(id, user);
  }

  createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  deleteTaskById(id: string, user: User): Promise<void> {
    return this.taskRepository.deleteTaskById(id, user);
  }

  patchTaskStatus(id: string, status: taskStatus, user: User): Promise<Task> {
    return this.taskRepository.patchTaskStatus(id, status, user);
  }
}
