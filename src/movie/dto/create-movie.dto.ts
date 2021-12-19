import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  year: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  cover: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  resume: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  cast: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  genres: string[];
}
