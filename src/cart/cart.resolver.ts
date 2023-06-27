import { Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';

@Resolver()
export class CartResolver {
    constructor(private readonly cartService: CartService) {}
}
