import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { Task } from './task.entity';
import { taskStatus } from './task-status.enum';

const mockTaskRepository = () => ({
  getAllTasks: jest.fn(),
  getTaskById: jest.fn(),
});
const mockUser: User = {
  username: 'John',
  password: '123456',
  id: '1',
  task: null,
};
const mockTask: Task = {
  title: 'title',
  description: 'description',
  id: '2',
  user: mockUser,
  status: taskStatus.OPEN,
};

describe('Tasks service', () => {
  let taskService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    taskService = module.get(TasksService);
    taskRepository = module.get(TaskRepository);
  });

  describe('getAllTasks', () => {
    it('calls taskRepository.getAllTasks and return tasks[]', async () => {
      expect(taskRepository.getAllTasks).not.toHaveBeenCalled();

      taskRepository.getAllTasks.mockResolvedValue('someValue');
      const result = await taskService.getAllTasks(null, mockUser);
      expect(taskRepository.getAllTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.getTaskById and return a task with that ID', async () => {
      expect(taskRepository.getTaskById).not.toHaveBeenCalled();

      taskRepository.getTaskById.mockResolvedValue(mockTask);
      const result = await taskService.getTaskById(mockTask.id, mockUser);
      expect(taskRepository.getTaskById).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });
  });
});
