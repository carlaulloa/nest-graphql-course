import { createParamDecorator, ExecutionContext, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CurrentUser = createParamDecorator((data, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const user = ctx.getContext().req.user;

  if (!user) {
    throw new InternalServerErrorException('No user in the request');
  }

  return user;
})