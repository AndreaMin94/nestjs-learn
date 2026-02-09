import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, ValidationPipe, UsePipes, UseGuards, Req } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './entities/books.entity';

import { UpdateBookDto } from './dto/update-book.dto';
import { LanguageValidationPipe } from 'src/common/pipes/language-validation/language-validation.pipe';
import { CreateBookDto } from './dto/create-book.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/entities/user.entity';
import { AccessControlGuard } from 'src/auth/guards/access-control.guard';

@UseGuards(AuthGuard, AccessControlGuard)
@Roles(Role.Viewer)
@UsePipes(new ValidationPipe()) //! al posto di usarlo come decoratore delle funzioni
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService){}

    @Get()
    @Roles(Role.Admin, Role.Viewer)
    findAll(@Req() request) {
        console.log("##### request user : ", request.user);
        return this.booksService.findAll();
    }

    @Post()
    @Roles(Role.Admin)
    @UsePipes(LanguageValidationPipe)
    // @UsePipes(new ValidationPipe()) //! al posto di usarlo nel body
        // create(@Body(new ValidationPipe()) body: CreateBookDto)
    create(@Body() body: CreateBookDto) {
        return this.booksService.createBook(body);
    }

    @Get(':id')
    @Roles(Role.Admin, Role.Viewer)
    findOne(@Param('id', ParseIntPipe) id: number ) {
        return this.booksService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.Admin)
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBookDto) {
        return this.booksService.updateBook(id, body);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.deleteBook(id);
    }
}
