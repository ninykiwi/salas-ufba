import {
  IsArray,
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';
import {
  SCHEDULE_CATEGORIES,
  SCHEDULE_RECURRENCES,
} from '../schemas/schedule.schema';
import type {
  ScheduleCategory,
  ScheduleRecurrence,
} from '../schemas/schedule.schema';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsIn(SCHEDULE_CATEGORIES)
  category: ScheduleCategory;

  @IsMongoId()
  room_id: string;

  @IsUUID()
  institute_id: string;

  @Matches(DATE_REGEX, { message: 'date deve estar no formato YYYY-MM-DD' })
  date: string;

  @Matches(TIME_REGEX, { message: 'start_time deve estar no formato HH:mm' })
  start_time: string;

  @Matches(TIME_REGEX, { message: 'end_time deve estar no formato HH:mm' })
  end_time: string;

  @IsInt()
  @Min(1)
  expected_audience: number;

  @IsIn(SCHEDULE_RECURRENCES)
  recurrence: ScheduleRecurrence;

  @ValidateIf((dto: CreateScheduleDto) => dto.recurrence !== 'unico')
  @Matches(DATE_REGEX, {
    message: 'recurrence_end_date deve estar no formato YYYY-MM-DD',
  })
  recurrence_end_date?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment_requested?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
