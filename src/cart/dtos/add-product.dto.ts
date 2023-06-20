import { IsNumber } from 'class-validator';

export class AddProductToCartDto {
    @IsNumber()
    SKU: number;

    @IsNumber()
    quantity: number;
}
