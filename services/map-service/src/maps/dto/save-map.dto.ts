import { IsArray, IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class SaveMapDto {
  @IsUUID()
  institute_id: string;

  @IsString()
  @IsNotEmpty()
  institute_name: string;

  @IsInt()
  @Min(0)
  floor: number;

  @IsArray()
  shapes: Record<string, any>[];
}
