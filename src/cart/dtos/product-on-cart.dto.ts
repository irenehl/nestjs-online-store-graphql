import { ProductDto } from '@product/dtos/product.dto';

export class SimpleProductOnCartDto {
    SKU: number;
    quantity: number;
}

export class ProductOnCartDto {
    quantity: number;
    product: ProductDto;
}
