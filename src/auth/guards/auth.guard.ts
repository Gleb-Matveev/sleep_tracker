import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getSession } from 'supertokens-node/recipe/session';
import type { VerifySessionOptions } from 'supertokens-node/recipe/session';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { GqlExecutionContext } from '@nestjs/graphql';

type ReqRes = { req: any; res: any };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private getReqRes(context: ExecutionContext): ReqRes {
    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context).getContext();
      return { req: gqlCtx.req, res: gqlCtx.res };
    }

    const http = context.switchToHttp();
    return { req: http.getRequest(), res: http.getResponse() };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let supertoken_id: string;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const { req, res } = this.getReqRes(context);
    res.locals.isLoggedIn = false;

    const session = await getSession(req, res, { sessionRequired: false });
    if (!session) { return false; }

    supertoken_id = session.getUserId();
    const user = await this.userRepository.findOne({ where: { supertoken_id } });
    if (!user) {
      throw new UnauthorizedException('Authenticated but no user was found');
    }

    res.locals.isLoggedIn = true;
    res.locals.email = user.email;
    res.locals.avatarUrl = user.avatar_url;

    req.user = {
      db_id: user.id,
      supertoken_id,
      sessionHandle: session.getHandle(),
    };
    req.session = session;

    console.log("End of guard");
    return true;
  }
}