import { IsString, IsNumber, IsOptional, IsArray, IsDateString, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDayDto {
  @IsDateString()
  date: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  getup_score: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  feeling_score: number;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'wakeUpTime must be in HH:mm format',
  })
  wakeUpTime: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'wakeDownTime must be in HH:mm format',
  })
  wakeDownTime: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  routineIds: number[];
}
