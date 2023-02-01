import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCreadentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtPlayload } from './auth-jwt.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger('Auth Repository');

  async createUser(authCreadentialDto: AuthCreadentialDto): Promise<void> {
    const { username, password } = authCreadentialDto;

    const salt = await bcrypt.genSalt();
    const hashpass = await bcrypt.hash(password, salt);

    const user: User = this.userEntityRepository.create({
      username,
      password: hashpass,
    });

    try {
      await this.userEntityRepository.save(user);
    } catch (err) {
      if (err.code == 23505) {
        this.logger.error(`Failed create user "${user.username}"`, err.stack);
        throw new ConflictException('Username already exists');
      } else {
        this.logger.error(`Failed create user "${user.username}"`, err.stack);
        throw new InternalServerErrorException();
      }
    }
  }

  async logInUser(
    authCreadentialDto: AuthCreadentialDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCreadentialDto;

    const user = await this.userEntityRepository.findOneBy({
      username: username,
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const playload: jwtPlayload = { username };
      const accessToken: string = await this.jwtService.sign(playload);
      return { accessToken };
    } else {
      this.logger.error(`Failed logining user "${user.username}"`);
      throw new UnauthorizedException('Please check your credentials');
    }
  }
}
