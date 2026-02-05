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
import { UserModel } from './models/user.model';
import { DayModel } from 'src/day/models/day.model';
import { RuleModel } from 'src/rule/models/rule.model';
import { RoutineModel } from 'src/routine/models/routine.model';
import { GoalModel } from 'src/goal/models/goal.model';

@Injectable()
export class UserAdapter {
  // API mappers
  toResponseDto(user: User): UserResponseDto {
    const userDto = new UserResponseDto();
    userDto.id = user.id;
    userDto.supertoken_id = user.supertoken_id;
    userDto.email = user.email;
    userDto.avatar_url = user.avatar_url;
    userDto.role = user.role;
    userDto.goals =
      user.goals?.map((goal) => this.toGoalResponseDto(goal)) || [];
    userDto.days = user.days?.map((day) => this.toDayResponseDto(day)) || [];
    userDto.rules =
      user.rules?.map((rule) => this.toRuleResponseDto(rule)) || [];
    userDto.routines =
      user.routines?.map((routine) => this.toRoutineResponseDto(routine)) || [];
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

  // GraphQL mappers
  toModel(user: User): UserModel {
    //console.log("User:", user);
    const userModel = new UserModel();
    userModel.id = user.id;
    userModel.supertoken_id = user.supertoken_id;
    userModel.email = user.email;
    userModel.avatar_url = user.avatar_url;
    userModel.role = user.role;
    userModel.goals =
      user.goals?.map((goal) => this.toGoalModel(goal)) || [];
    userModel.days = 
      user.days?.map((day) => this.toDayModel(day)) || [];
    userModel.rules =
      user.rules?.map((rule) => this.toRuleModel(rule)) || [];
    userModel.routines =
      user.routines?.map((routine) => this.toRoutineModel(routine)) || [];
    return userModel;
  }

  toGoalModel(goal: Goal): GoalModel {
    return {
      id: goal.id,
      name: goal.name,
      description: goal.description,
      status: goal.status,
    };
  }

  toRoutineModel(routine: Routine): RoutineModel {
    return {
      id: routine.id,
      name: routine.name,
      period: routine.period,
      steps: routine.steps,
    };
  }

  toRuleModel(rule: Rule): RuleModel {
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
    };
  }

  toDayModel(day: Day): DayModel {
    return {
      id: day.id,
      date: day.date,
      getup_score: day.getup_score,
      feeling_score: day.feeling_score,
      wakeUpTime: day.wakeUpTime,
      wakeDownTime: day.wakeDownTime,
      description: day.description,
      routines: []
    };
  }
}
