import { CreateGoalDto } from './dto/create-goal.dto';
import { Goal } from './entities/goal.entity';
import { CreateGoalInput } from './inputs/create-goal.input';
import { GoalModel } from './models/goal.model';

export class GoalAdapter {
    toModel(goal: Goal): GoalModel {
        return {
            id: goal.id,
            name: goal.name,
            description: goal.description,
            status: goal.status,
            //user: goal.user
        };
    }
    toDto(createGoalInput: CreateGoalInput): CreateGoalDto {
        const goal = new CreateGoalDto();
        goal.name = createGoalInput.name;
        goal.description = createGoalInput.description;
        goal.status = createGoalInput.status;
        //goal.user = createGoalInput.user;
        return goal;
    }
}