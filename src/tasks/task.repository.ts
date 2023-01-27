import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { taskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskEntityRepo: Repository<Task>,
  ) {}

  async getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskEntityRepo.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskEntityRepo.findOneBy({
      id: id,
    });
    if (!found) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: createTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskEntityRepo.create({
      title,
      description,
      status: taskStatus.OPEN,
    });
    await this.taskEntityRepo.save(task);
    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    const found = await this.taskEntityRepo.delete(id);
    if (found.affected == 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
  }

  async patchTaskStatus(id: string, status: taskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.taskEntityRepo.save(task);

    return task;
  }
}
