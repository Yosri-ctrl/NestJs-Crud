import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { jwtPlayload } from './auth-jwt.interface';
import { User } from './user.entity';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('TYPEORM_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(playload: jwtPlayload): Promise<User> {
    const { username } = playload;
    const user: User = await this.userEntityRepository.findOneBy({
      username: username,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
