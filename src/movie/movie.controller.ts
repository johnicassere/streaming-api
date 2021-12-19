import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly service: MovieService) {}

  @UseGuards(AuthGuard())
  @Post('create')
  @ApiOperation({
    summary: 'Criar um filme',
  })
  @ApiBearerAuth()
  create(@Body() data: CreateMovieDto): Promise<Movie> {
    return this.service.create(data);
  }

  @UseGuards(AuthGuard())
  @Post('createMany')
  @ApiOperation({
    summary: 'Criar vários filmes',
  })
  @ApiBearerAuth()
  createMany(@Body() data: CreateMovieDto[]): Promise<Movie[]> {
    return this.service.createMany(data);
  }

  @Get('findMany')
  @ApiOperation({
    summary: 'Listar todos os filmes cadastrados',
  })
  findMany(): Promise<Movie[]> {
    return this.service.findMany();
  }

  @Get('findUnique/:id')
  @ApiOperation({
    summary: 'Encontrar um filme pelo ID',
  })
  findUnique(@Param('id') id: string): Promise<Movie> {
    return this.service.findUnique(id);
  }

  @UseGuards(AuthGuard())
  @Patch('update/:id')
  @ApiOperation({
    summary: 'Atualizar um filme pelo ID',
  })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() data: UpdateMovieDto,
  ): Promise<Movie> {
    return this.service.update(id, data);
  }

  @UseGuards(AuthGuard())
  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Deletar um filme pelo ID',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.delete(id);
  }

  @UseGuards(AuthGuard())
  @Delete('deleteMany')
  @ApiOperation({
    summary: 'Deletar todos os dados do banco',
  })
  @ApiBearerAuth()
  deleteMany(): Promise<{ count: number }> {
    return this.service.deleteMany();
  }
}
