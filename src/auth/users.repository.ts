import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCreadentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  async createUser(authCreadentialDto: AuthCreadentialDto): Promise<void> {
    const { username, password } = authCreadentialDto;
    const user: User = this.userEntityRepository.create({
      username,
      password,
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
}
