import { createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const GQLUserId = createParamDecorator(
  (_, ctx) => {
    const gql = GqlExecutionContext.create(ctx);
    const req = gql.getContext().req;

    return req.user.db_id as number;
  }
);
