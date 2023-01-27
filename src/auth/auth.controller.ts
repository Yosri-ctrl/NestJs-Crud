import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCreadentialDto } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() authCreadentialDto: AuthCreadentialDto) {
    return this.authService.signUp(authCreadentialDto);
  }

  @Post('/signin')
  signin(
    @Body() authCreadentialDto: AuthCreadentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCreadentialDto);
  }
}
