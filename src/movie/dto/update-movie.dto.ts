import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  year: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  cover: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  resume: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  cast: string[];

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  genres: string[];
}
