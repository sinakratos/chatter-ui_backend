import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGurd extends AuthGuard('jwt') {}
