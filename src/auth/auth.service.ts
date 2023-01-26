import { Injectable } from '@nestjs/common';
import { AuthCreadentialDto } from './dto/auth-credential.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  signUp(authCreadentialDto: AuthCreadentialDto): Promise<void> {
    return this.userRepository.createUser(authCreadentialDto);
  }
}
