import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateInstituteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  @Max(20)
  floors: number;
}
