import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import {
  ROOM_RESOURCES,
  ROOM_STATUSES,
  ROOM_TYPES,
} from '../schemas/room.schema';
import type { RoomStatus, RoomType } from '../schemas/room.schema';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  institute_id: string;

  @IsString()
  @IsNotEmpty()
  floor: string;

  @IsIn(ROOM_TYPES)
  type: RoomType;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(ROOM_RESOURCES, { each: true })
  resources?: string[];

  @IsOptional()
  @IsIn(ROOM_STATUSES)
  status?: RoomStatus;
}
