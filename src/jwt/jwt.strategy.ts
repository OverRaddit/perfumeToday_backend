import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
    console.log('jwtStrategy:', process.env.JWT_SECRET);
  } // asdfasdfasdfa

  async validate(payload: any): Promise<any> {
    // Perform any additional validations or checks if required
    console.log('[validate] payload:', payload);
    return { userId: payload.userId };
  }
}
