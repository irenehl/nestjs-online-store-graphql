import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/category.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Role } from '@auth/decorators/role.decorator';
import { RolesGuard } from '@auth/guards/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryBodyDto } from './dtos/category-body.dto';
import { ValidationPipe } from '@pipes/validation.pipe';

@ApiTags('Category')
@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Post()
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async create(@Body() data: CategoryBodyDto): Promise<CategoryDto> {
        return this.categoryService.create(data);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<CategoryDto> {
        return this.categoryService.findOne({ id: Number(id) });
    }

    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<CategoryDto[]> {
        return this.categoryService.findAll({ page, limit });
    }

    @Patch(':id')
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe()) data: CategoryBodyDto
    ): Promise<CategoryDto> {
        return this.categoryService.update({ id: Number(id) }, data);
    }

    @Delete(':id')
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async delete(@Param('id') id: string): Promise<CategoryDto> {
        return this.categoryService.delete({ id: Number(id) });
    }
}
