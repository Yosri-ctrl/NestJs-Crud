import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCreadentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtPlayload } from 'src/auth/auth-jwt.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

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
      // If user already exists
      if (err.code == 23505) {
        throw new ConflictException('Username already exists');
      } else {
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
      throw new UnauthorizedException('Please check your credentials');
    }
  }
}
