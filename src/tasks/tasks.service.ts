import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { taskStatus } from './task-status.enum';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getAllTasks(filterDto);
  }

  getTaskById(id: string): Promise<Task> {
    return this.taskRepository.getTaskById(id);
  }

  createTask(createTaskDto: createTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  deleteTaskById(id: string): Promise<void> {
    return this.taskRepository.deleteTaskById(id);
  }

  patchTaskStatus(id: string, status: taskStatus): Promise<Task> {
    return this.taskRepository.patchTaskStatus(id, status);
  }
}
