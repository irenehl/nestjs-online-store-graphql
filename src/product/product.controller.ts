import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dtos/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { User } from '@user/decorators/user.decorator';
import { PayloadDto } from '@auth/dtos/payload.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/role.guard';
import { Role } from '@auth/decorators/role.decorator';
import { Public } from '@auth/decorators/public.decorator';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @UseInterceptors(FileInterceptor('image'))
    @Post()
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async create(
        @Body(new ValidationPipe()) data: CreateProductDto,
        @UploadedFile() image?: Express.Multer.File
    ): Promise<ProductDto> {
        return this.productService.create(data, image);
    }

    @Public()
    @Get(':sku')
    async findOne(@Param('sku') sku: string): Promise<ProductDto> {
        return this.productService.findOne({ SKU: Number(sku) });
    }

    @Get('category/:id')
    async getProductByCategory(@Param('id') id: string): Promise<ProductDto[]> {
        return this.productService.getProductByCategory(Number(id));
    }

    @Public()
    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<ProductDto[]> {
        return this.productService.findAll({ page, limit });
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch(':sku')
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async update(
        @Body(new ValidationPipe()) data: UpdateProductDto,
        @Param('sku') sku: string,
        @UploadedFile() image?: Express.Multer.File
    ): Promise<Partial<ProductDto>> {
        return this.productService.update(Number(sku), data, image);
    }

    @Patch(':sku/toggle')
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async toggle(@Param('sku') sku: string): Promise<ProductDto> {
        return this.productService.toggle(Number(sku));
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':sku/like')
    async likeProduct(@Param('sku') sku: string, @User() user: PayloadDto) {
        return this.productService.likeProduct(Number(user.sub), Number(sku));
    }

    @Delete(':sku')
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async delete(@Param('sku') sku: string): Promise<ProductDto> {
        return this.productService.delete(Number(sku));
    }
}
