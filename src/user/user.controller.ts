import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Movie, User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import AuthUser from 'src/auth/auth-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Criar um usuário',
  })
  create(@Body() data: CreateUserDto): Promise<User> {
    return this.service.create(data);
  }

  @UseGuards(AuthGuard())
  @Patch('update')
  @ApiOperation({
    summary: 'Atualizar o usuário autenticado',
  })
  @ApiBearerAuth()
  update(@AuthUser() user: User, @Body() data: UpdateUserDto): Promise<User> {
    return this.service.update(user, data);
  }

  @UseGuards(AuthGuard())
  @Delete('delete')
  @ApiOperation({
    summary: 'Deletar o usuário autenticado',
  })
  @ApiBearerAuth()
  delete(@AuthUser() user: User): Promise<{ message: string }> {
    return this.service.delete(user);
  }

  @UseGuards(AuthGuard())
  @Patch('addList/:id')
  @ApiOperation({
    summary:
      'Adicionar um filme na lista de filmes assistidos pelo usuário autenticado',
  })
  @ApiBearerAuth()
  addList(@AuthUser() user: User, @Param('id') movieId: string): Promise<any> {
    return this.service.addList(user, movieId);
  }

  @UseGuards(AuthGuard())
  @Get('seeList')
  @ApiOperation({
    summary:
      'Ver quais os filmes estão na lista de filmes assistidos pelo usuário autenticado',
  })
  @ApiBearerAuth()
  seeList(@AuthUser() user: User): Promise<Movie[]> {
    return this.service.seeList(user);
  }
}
