import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user.db_id as number;
});

