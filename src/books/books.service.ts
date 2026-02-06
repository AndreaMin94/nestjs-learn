import { Injectable, NotFoundException } from '@nestjs/common';
import { Book, Language } from './entities/books.entity';

import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import PostgreSQLErrorCode from 'src/common/errors/postgresql-error-codes';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        configService: ConfigService
    ){ }

    findAll() {
        return this.bookRepository.find();
    }

    createBook(book: CreateBookDto) {
        const createdBook = this.bookRepository.create({
            ...book,
            author: {
                id: book.authorId
            }
        });
        try {
            return this.bookRepository.save(createdBook);
        } catch (error) {
            if (error.code === PostgreSQLErrorCode.ForeignKeyViolation) {
                throw new NotFoundException(`Author with id ${book.authorId} doesn't exist`)
            }
            throw error
        }
    }

    findOne(id: number) {
        const book = this.bookRepository.findOne({where: {id}});
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }

    async updateBook(id: number, book: UpdateBookDto) {
        const bookYoUpdate = await this.bookRepository.findOne({where: {id}});
        if (!bookYoUpdate) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        Object.assign(bookYoUpdate, book);
        return this.bookRepository.save(bookYoUpdate);
    }

    async deleteBook(id: number) {
        const book = await this.bookRepository.findOneBy({id: id});
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return this.bookRepository.remove(book);
    }

    async findBooks(filterDto: GetBookFilterDto) {
        const { search, publicationDate, language } = filterDto;
        const query = this.bookRepository.createQueryBuilder('book').leftJoinAndSelect('book.author', 'author');

        if(search) {
            query.andWhere('(book.title LIKE :search OR book.author LIKE :search)', { search: `%${search}&`});
        }

        if (publicationDate) {
            query.andWhere('book.publicationDate = :publicationDate', { publicationDate });
        }

        if (language) {
            query.andWhere('book.language = :language', { language });
        }

        const books = await query.getMany();
        return books;

    }

}
