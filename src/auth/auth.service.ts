import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<UserEntity> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'password', 'nom', 'prenom'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async getUser(identifier: number | string): Promise<UserEntity> {
    let user: UserEntity | null = null;
    if (typeof identifier === 'number') {
      user = await this.userRepository.findOne({ where: { id: identifier } });
    } else if (typeof identifier === 'string') {
      // On suppose que c'est un token JWT
      try {
        const payload = await this.jwtService.verifyAsync(identifier);
        user = await this.userRepository.findOne({ where: { id: payload.sub } });
      } catch {
        throw new UnauthorizedException('Token invalide');
      }
    }
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }
}
