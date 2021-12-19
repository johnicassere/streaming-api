import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Movie, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private database: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    if (data.password !== data.passwordConfirmation) {
      throw new UnauthorizedException(
        'A senha e a confirmação da senha não são compativeis',
      );
    }

    const userExists = await this.database.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('E-mail já está cadastrado');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    delete data.passwordConfirmation;

    const user = await this.database.user.create({
      data: {
        ...data,
        password: passwordHash,
      },
    });

    delete user.password;
    return user;
  }

  async update(user: User, data: UpdateUserDto): Promise<User> {
    const userUpdated = await this.database.user.update({
      data: data,
      where: { id: user.id },
    });

    delete userUpdated.password;

    return userUpdated;
  }

  async delete(user: User): Promise<{ message: string }> {
    const userExists = await this.database.user.findUnique({
      where: { id: user.id },
    });

    if (!userExists) {
      throw new NotFoundException(
        'Usuário com o ID informado não foi encontrado',
      );
    } else {
      await this.database.user.delete({
        where: { id: user.id },
      });
    }

    return {
      message: 'Id foi encontrado e deletado com sucesso',
    };
  }

  async addList(user: User, movieId: string): Promise<{ message: string }> {
    const movie = await this.database.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Filme não encontrada');
    }

    const userMovies = await this.database.user.findUnique({
      where: { id: user.id },
      include: {
        movies: true,
      },
    });

    const userMoviesArray = userMovies.movies;
    let foundMovie = false;

    userMoviesArray.map((movie) => {
      if (movie.id === movieId) {
        foundMovie = true;
      }
    });

    if (foundMovie) {
      await this.database.user.update({
        where: { id: user.id },
        data: {
          movies: {
            disconnect: {
              id: movie.id,
            },
          },
        },
        include: {
          movies: true,
        },
      });

      return { message: 'Filme removido da lista' };
    } else {
      await this.database.user.update({
        where: { id: user.id },
        data: {
          movies: {
            connect: {
              id: movie.id,
            },
          },
        },
        include: {
          movies: true,
        },
      });

      return { message: 'Filme adicionada na lista' };
    }
  }

  async seeList(user: User): Promise<Movie[]> {
    const userMovies = await this.database.user.findUnique({
      where: { id: user.id },
      include: {
        movies: true,
      },
    });

    const userMoviesArray = userMovies.movies;
    return userMoviesArray;
  }
}
