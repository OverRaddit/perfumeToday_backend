import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: () => ({
				secret: process.env.JWT_SECRET,
				signOptions: {
					//expiresIn: '1h',
				},
			}),
		}),
	],
	providers: [JwtAuthService, JwtStrategy],
	exports: [JwtAuthService, JwtStrategy],
})
export class JwtConfigModule {}

// 준영 ㅎㅇ 😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎
