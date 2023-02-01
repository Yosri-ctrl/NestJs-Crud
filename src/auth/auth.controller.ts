import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCreadentialDto } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private logger = new Logger('Auth Controller');

  @Post('/signup')
  createUser(@Body() authCreadentialDto: AuthCreadentialDto) {
    this.logger.verbose(
      `Signing up a user with username: ${authCreadentialDto.username}`,
    );
    return this.authService.signUp(authCreadentialDto);
  }

  @Post('/signin')
  signin(
    @Body() authCreadentialDto: AuthCreadentialDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(
      `Signing in a user with username: ${authCreadentialDto.username}`,
    );
    return this.authService.signIn(authCreadentialDto);
  }
}
