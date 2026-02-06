import { IsEnum, IsOptional, IsString } from "class-validator";
import { Language } from "../entities/books.entity";


export class GetBookFilterDto {
    @IsOptional()
    @IsString()
    search?: string;
    @IsOptional()
    @IsString()
    author?: string;
    @IsOptional()
    @IsString()
    publicationDate?: string;
    @IsOptional()
    @IsEnum(Language)
    language?: Language;
}