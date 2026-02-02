import { IsString, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsUUID()
  @IsNotEmpty()
  supertoken_id: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
