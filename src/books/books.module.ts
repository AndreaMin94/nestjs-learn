import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entities/books.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from 'src/authors/entities/author.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  //! rendiamo disponibile l'entità Book a tutti i componenti del modulo
  imports: [TypeOrmModule.forFeature([Book, Author]), JwtModule],
  controllers: [BooksController],
  providers: [BooksService]
})
export class BooksModule {}
