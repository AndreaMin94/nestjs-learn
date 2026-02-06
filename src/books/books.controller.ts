import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, ValidationPipe, UsePipes } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './entities/books.entity';

import { UpdateBookDto } from './dto/update-book.dto';
import { LanguageValidationPipe } from 'src/common/pipes/language-validation/language-validation.pipe';
import { CreateBookDto } from './dto/create-book.dto';

@UsePipes(new ValidationPipe()) //! al posto di usarlo come decoratore delle funzioni
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService){}

    @Get()
    findAll() {
        return this.booksService.findAll();
    }

    @Post()
    @UsePipes(LanguageValidationPipe)
    // @UsePipes(new ValidationPipe()) //! al posto di usarlo nel body
        // create(@Body(new ValidationPipe()) body: CreateBookDto)
    create(@Body() body: CreateBookDto) {
        return this.booksService.createBook(body);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number ) {
        return this.booksService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBookDto) {
        return this.booksService.updateBook(id, body);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.deleteBook(id);
    }
}
