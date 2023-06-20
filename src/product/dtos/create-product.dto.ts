import { IsNumberOrString } from '@validators/is-number-or-string.validator';
import { IsString, Validate } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @Validate(IsNumberOrString)
    price: number | string;

    @Validate(IsNumberOrString)
    stock: number | string;

    @IsString()
    category: string;
}
