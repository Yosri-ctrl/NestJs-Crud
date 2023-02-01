import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
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
  private logger = new Logger('Tasks Repository');

  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskEntityRepo.createQueryBuilder('task');
    query.where({ user: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Failed to retrieve data for user "${user.username}"`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskEntityRepo.findOneBy({
      id,
      user,
    });

    if (!found) {
      this.logger.error(`Failed to retrieve data for task "${found.id}"`);
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskEntityRepo.create({
      title,
      description,
      status: taskStatus.OPEN,
      user,
    });
    await this.taskEntityRepo.save(task);
    return task;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const found = await this.taskEntityRepo.delete({ id, user });
    if (found.affected == 0) {
      this.logger.error(`Failed to retrieve data for task "${id}"`);
      throw new NotFoundException(`Task with ${id} not found`);
    }
  }

  async patchTaskStatus(
    id: string,
    status: taskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.taskEntityRepo.save(task);

    return task;
  }
}
