import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';

const mockTaskRepository = () => ({
  getAllTasks: jest.fn(),
});
const mockUser = {
  username: 'John',
  password: '123456',
  id: '1',
  task: null,
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
});
