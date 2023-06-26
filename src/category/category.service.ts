import { IPagination } from '@common/interfaces/pagination.dto';
import { PrismaService } from '@config/prisma.service';
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CategoryDto } from './dtos/category.dto';
import { PaginationArgs } from '@common/dto/args/pagination.arg';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    private async exists(where: Prisma.CategoryWhereUniqueInput) {
        return (await this.prisma.category.findUnique({ where })) !== null;
    }

    async create(data: Prisma.CategoryCreateInput): Promise<Category> {
        if (await this.exists({ name: data.name }))
            throw new ConflictException(`Category ${data.name} already exists`);

        return this.prisma.category.create({ data });
    }

    async findOne(
        where: Prisma.CategoryWhereUniqueInput
    ): Promise<Category> {
        const result = await this.prisma.category
            .findFirstOrThrow({
                where,
            })
            .catch(() => {
                throw new NotFoundException('Category not found');
            });

        return result;
    }

    async findAll(
        params: PaginationArgs & {
            cursor?: Prisma.CategoryWhereUniqueInput;
            where?: Prisma.CategoryWhereInput;
            orderBy?: Prisma.CategoryOrderByWithAggregationInput;
        }
    ): Promise<Category[]> {
        const { page, limit, cursor, where, orderBy } = params; 

        const a = await this.prisma.category.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where,
            orderBy,
        });

        return a;
    }

    async update(
        where: Prisma.CategoryWhereUniqueInput,
        data: Prisma.CategoryUpdateInput
    ): Promise<Category> {
        const _ = await this.findOne(where);

        return this.prisma.category.update({
            data,
            where,
        });
    }

    async delete(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
        const _ = await this.findOne(where);

        return await this.prisma.category.delete({ where });
    }
}
