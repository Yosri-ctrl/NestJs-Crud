import { IsEnum } from 'class-validator';
import { taskStatus } from '../task.module';

export class UpdateTaskStatusDto {
  @IsEnum(taskStatus)
  status: taskStatus;
}
