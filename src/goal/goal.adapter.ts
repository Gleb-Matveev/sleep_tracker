import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { CreateGoalInput } from './inputs/create-goal.input';
import { UpdateGoalInput } from './inputs/update-goal.input';
import { GoalModel } from './models/goal.model';
import { GoalResponseDto } from './dto/goal-response.dto';

@Injectable()
export class GoalAdapter {
    toModel(goal: Goal): GoalModel {
        return {
            id: goal.id,
            name: goal.name,
            description: goal.description,
            status: goal.status,
        };
    }
    
    toCreateDto(createGoalInput: CreateGoalInput): CreateGoalDto {
        const goal = new CreateGoalDto();
        goal.name = createGoalInput.name;
        goal.description = createGoalInput.description;
        goal.status = createGoalInput.status;
        return goal;
    }

    toUpdateDto(updateGoalDto: UpdateGoalInput): UpdateGoalDto {
        const goal = new UpdateGoalDto();
        goal.name = updateGoalDto.name;
        goal.description = updateGoalDto.description;
        goal.status = updateGoalDto.status;
        return goal;
    }

    toResponseDto(goal: Goal): GoalResponseDto {
        const goalDto = new GoalResponseDto();
        goalDto.id = goal.id;
        goalDto.name = goal.name;
        goalDto.description = goal.description;
        goalDto.image_url = goal.image_url;
        goalDto.status = goal.status;
        return goalDto;
    }
}