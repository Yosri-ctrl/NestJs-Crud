import { taskStatus } from '../task.module';

export class GetTasksFilterDto {
  status?: taskStatus;
  search?: string;
}
