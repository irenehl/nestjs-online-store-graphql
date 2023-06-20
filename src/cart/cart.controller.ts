import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AddProductToCartDto } from './dtos/add-product.dto';
import { CartDto } from './dtos/cart.dto';
import { User } from '@user/decorators/user.decorator';
import { PayloadDto } from '@auth/dtos/payload.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Get()
    async findOne(@User() user: PayloadDto) {
        return this.cartService.findOne(Number(user.sub));
    }

    @Post()
    async addProduct(
        @User() user: PayloadDto,
        @Body() data: AddProductToCartDto
    ): Promise<CartDto> {
        return this.cartService.addProduct(Number(user.sub), data);
    }

    @Delete(':sku')
    async deleteProductOnCart(
        @User() user: PayloadDto,
        @Param('sku') SKU: string
    ) {
        return this.cartService.deleteProductOnCart(
            Number(user.sub),
            Number(SKU)
        );
    }
}
