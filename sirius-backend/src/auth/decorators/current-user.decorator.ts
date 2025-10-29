import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../intefaces/request-user.interface';

export const CurrentUser = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{
      user: RequestUser;
    }>();

    return request.user;
  },
);
