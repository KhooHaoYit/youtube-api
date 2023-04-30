import { Strategy } from 'passport-http-bearer';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { env } from 'src/env';

@Injectable()
export class SharedSecretStrategy extends PassportStrategy(Strategy, 'SharedSecret') {

  constructor() {
    super();
  }

  async validate(token: string): Promise<boolean> {
    const [primary, secondary] = token.split(':');
    if (primary !== env.PRIMARY_API_KEY)
      throw new UnauthorizedException();
    if (env.SECONDARY_API_KEY!.indexOf(secondary) === -1)
      throw new UnauthorizedException();
    return true;
  }

}

@Injectable()
export class SharedSecretAuthGuard extends AuthGuard('SharedSecret') {

  canActivate(...args: Parameters<CanActivate['canActivate']>): ReturnType<CanActivate['canActivate']> {
    if (!env.PRIMARY_API_KEY || !env.SECONDARY_API_KEY)
      return true;
    return super.canActivate(...args);
  }

}
