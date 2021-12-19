import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, MovieModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
