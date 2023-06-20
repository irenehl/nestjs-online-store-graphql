import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsNumber()
    @IsOptional()
    stock?: number;

    @IsBoolean()
    @IsOptional()
    available?: boolean;

    @IsString()
    @IsOptional()
    category?: string;
}
