import { IsEmail, IsString, MinLength, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  age: number;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}