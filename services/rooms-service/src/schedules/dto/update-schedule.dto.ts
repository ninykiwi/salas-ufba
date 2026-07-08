import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateScheduleDto } from './create-schedule.dto';
import { SCHEDULE_STATUSES } from '../schemas/schedule.schema';
import type { ScheduleStatus } from '../schemas/schedule.schema';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @IsOptional()
  @IsIn(SCHEDULE_STATUSES)
  status?: ScheduleStatus;
}
