
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Language } from "../entities/books.entity";

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNotEmpty()
    @IsInt()
    authorId: number;
    @IsNotEmpty()
    @IsString()
    publicationDate: string;
    @IsNotEmpty()
    @IsNumber()
    numberOfPages: number;
    @IsNotEmpty()
    @IsEnum(Language)
    language: Language;
}
