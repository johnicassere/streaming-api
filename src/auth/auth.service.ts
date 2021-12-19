import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CrendentialsDto } from './dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private database: PrismaService, private jwt: JwtService) {}

  async login(data: CrendentialsDto) {
    const userExists = await this.database.user.findUnique({
      where: { email: data.email },
    });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      userExists.password,
    );

    if (passwordMatches) {
      const payload = {
        email: userExists.email,
      };

      const token = await this.jwt.sign(payload);

      return { token };
    } else {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }
}
