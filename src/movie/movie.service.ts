import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma.service';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieService {
  constructor(private database: PrismaService) {}

  async create(data: CreateMovieDto): Promise<Movie> {
    const movieExists = await this.database.movie.findFirst({
      where: { title: data.title },
    });

    if (movieExists) {
      throw new ConflictException('Esss filme já está cadastrada');
    }

    const movie = await this.database.movie.create({ data: data });
    return movie;
  }

  async createMany(data: CreateMovieDto[]): Promise<Movie[]> {
    data.map(async (movie) => {
      const movieExists = await this.database.movie.findFirst({
        where: { title: movie.title },
      });

      if (!movieExists) {
        await this.database.movie.create({ data: movie });
      }
    });

    const movies = await this.database.movie.findMany();
    return movies;
  }

  async findMany(): Promise<Movie[]> {
    const movies = await this.database.movie.findMany();
    return movies;
  }

  async findUnique(id: string): Promise<Movie> {
    const movieExists = await this.database.movie.findUnique({
      where: { id },
    });

    if (!movieExists) {
      throw new NotFoundException(
        'Filme com o ID informado não foi encontrado',
      );
    }

    return movieExists;
  }

  async update(id: string, data: UpdateMovieDto): Promise<Movie> {
    const movie = await this.database.movie.update({
      data: data,
      where: { id },
    });
    return movie;
  }

  async delete(id: string): Promise<{ message: string }> {
    const movieExists = await this.database.movie.findUnique({
      where: { id },
    });

    if (!movieExists) {
      throw new NotFoundException(
        'Filme com o ID informado não foi encontrado',
      );
    } else {
      await this.database.movie.delete({
        where: { id },
      });
    }

    return { message: 'Id foi encontrado e deletado ' };
  }

  async deleteMany(): Promise<{ count: number }> {
    const deleted = await this.database.movie.deleteMany({});
    return deleted;
  }
}
