import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string; // E-mail ou SIAPE

  @IsString()
  @IsNotEmpty()
  password: string;
}
