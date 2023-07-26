import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
    super();
  }

	// handleRequest(err, user, info: Error, context: ExecutionContext) {
  //   if (err || info || !user) {
  //     throw err || info || 'Unauthorized';
  //   }
  //   return user;
  // }
}
