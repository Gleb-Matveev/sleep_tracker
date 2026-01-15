import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDayDto } from './create-day.dto';

export class UpdateDayDto extends PartialType(
  OmitType(CreateDayDto, ['routineIds'] as const), ) {
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  routineIds?: number[];
}
