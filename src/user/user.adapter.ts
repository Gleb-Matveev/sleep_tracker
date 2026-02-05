import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { Routine } from 'src/routine/entities/routine.entity';
import { RoutineResponseDto } from 'src/routine/dto/routine-response.dto';
import { Rule } from 'src/rule/entities/rule.entity';
import { RuleResponseDto } from 'src/rule/dto/rule-response.dto';
import { Day } from 'src/day/entities/day.entity';
import { DayResponseDto } from 'src/day/dto/day-response.dto';
import { Goal } from 'src/goal/entities/goal.entity';
import { GoalResponseDto } from 'src/goal/dto/goal-response.dto';

@Injectable()
export class UserAdapter {
  toResponseDto(user: User): UserResponseDto {
    const userDto = new UserResponseDto();
    userDto.id = user.id;
    userDto.supertoken_id = user.supertoken_id;
    userDto.email = user.email;
    userDto.avatar_url = user.avatar_url;
    userDto.role = user.role;
    userDto.goals = user.goals?.map((goal) => this.toGoalResponseDto(goal)) || [];
    userDto.days = user.days?.map((day) => this.toDayResponseDto(day)) || [];
    userDto.rules = user.rules?.map((rule) => this.toRuleResponseDto(rule)) || [];
    userDto.routines = user.routines?.map((routine) => this.toRoutineResponseDto(routine)) || [];
    return userDto;
  }

  toDayResponseDto(day: Day): DayResponseDto {
    const dayDto = new DayResponseDto();
    dayDto.id = day.id;
    dayDto.date = day.date;
    dayDto.description = day.description;
    dayDto.feeling_score = day.feeling_score;
    dayDto.getup_score = day.getup_score;
    dayDto.wakeUpTime = day.wakeUpTime;
    dayDto.wakeDownTime = day.wakeDownTime;
    return dayDto;
  }

  toRuleResponseDto(rule: Rule): RuleResponseDto {
    const ruleDto = new RuleResponseDto();
    ruleDto.id = rule.id;
    ruleDto.name = rule.name;
    ruleDto.description = rule.description;
    return ruleDto;
  }

  toRoutineResponseDto(routine: Routine): RoutineResponseDto {
    const routineDto = new RoutineResponseDto();
    routineDto.id = routine.id;
    routineDto.name = routine.name;
    routineDto.period = routine.period;
    routineDto.steps = routine.steps;
    return routineDto;
  }

  toGoalResponseDto(goal: Goal): GoalResponseDto {
    const goalDto = new GoalResponseDto();
    goalDto.id = goal.id;
    goalDto.name = goal.name;
    goalDto.description = goal.description;
    goalDto.image_url = goal.image_url;
    goalDto.status = goal.status;
    return goalDto;
  }
}
