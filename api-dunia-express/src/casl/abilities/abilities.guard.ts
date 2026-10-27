import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../ability.factory.js';
import {
  CHECK_ABILITY,
  RequiredRule,
} from '../decorators/check-abilities.decorator.js';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getClass()) ||
      [];

    if (rules.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.id) {
      throw new UnauthorizedException('User is not authenticated');
    }

    const ability = await this.caslAbilityFactory.createForUser(user.id);

    const isAllowed = rules.every((rule) =>
      ability.can(rule.action, rule.subject),
    );

    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return true;
  }
}
