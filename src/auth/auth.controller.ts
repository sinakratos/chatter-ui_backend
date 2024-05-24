import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';

import { User } from 'src/users/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	async login(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		await this.authService.login(user, response);
	}
}
