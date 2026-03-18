import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ValidRoles } from "../enums/valid-roles.enum";

export const CurrentUser = createParamDecorator((roles: ValidRoles[], context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const user = ctx.getContext().req.user;

  if (!user) {
    throw new InternalServerErrorException('No user in the request');
  }

  if (!roles?.length) {
    return user;
  }

  for (const role of roles) {
    if (roles.includes(role)) {
      return user;
    }
  }

  throw new ForbiddenException(`User ${user.fullName} does not have a valid role`);
})