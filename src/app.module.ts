  import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/entities/books.entity';
import { AuthorsModule } from './authors/authors.module';
import { Author } from './authors/entities/author.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.dev.env', '.env'],
      isGlobal: true,
    }),
    BooksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: +(configService.get<string>('DATABASE_PORT') || 5432),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Book, Author],
        synchronize: true,
      }),
    }),
    AuthorsModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
