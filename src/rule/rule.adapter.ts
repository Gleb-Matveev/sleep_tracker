import { CreateRuleDto } from "./dto/create-rule.dto";
import { UpdateRuleDto } from "./dto/update-rule.dto";
import { CreateRuleInput } from "./inputs/create-rule.input";
import { UpdateRuleInput } from "./inputs/update-rule.input";
import { Rule } from "./entities/rule.entity";
import { RuleModel } from "./models/rule.model"
import { Injectable } from "@nestjs/common";
import { RuleResponseDto } from "./dto/rule-response.dto";

@Injectable()
export class RuleAdapter {
    toModel(rule: Rule): RuleModel {
        return {
            id: rule.id,
            name: rule.name,
            description: rule.description,
            //user: rule.user
        };
    }
    
    toCreateDto(createRuleInput: CreateRuleInput): CreateRuleDto {
        const rule = new CreateRuleDto();
        rule.name = createRuleInput.name;
        rule.description = createRuleInput.description;
        //rule.user = createRuleInput.user;
        return rule;
    }

    toUpdateDto(updateRuleDto: UpdateRuleInput): UpdateRuleDto {
        const rule = new UpdateRuleDto();
        rule.name = updateRuleDto.name;
        rule.description = updateRuleDto.description;
        //rule.user = createRuleInput.user;
        return rule;
    }

    toResponseDto(rule: Rule): RuleResponseDto {
        const ruleDto = new RuleResponseDto();
        ruleDto.id = rule.id;
        ruleDto.name = rule.name;
        ruleDto.description = rule.description;
        return ruleDto;
    }
}