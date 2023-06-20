import { IPagination } from '@common/interfaces/pagination.dto';
import { PrismaService } from '@config/prisma.service';
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CategoryDto } from './dtos/category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    private async exists(where: Prisma.CategoryWhereUniqueInput) {
        return (await this.prisma.category.findUnique({ where })) !== null;
    }

    async create(data: Prisma.CategoryCreateInput) {
        if (await this.exists({ name: data.name }))
            throw new ConflictException(`Category ${data.name} already exists`);

        return this.prisma.category.create({ data });
    }

    async findOne(
        where: Prisma.CategoryWhereUniqueInput
    ): Promise<CategoryDto> {
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
        params: IPagination & {
            cursor?: Prisma.CategoryWhereUniqueInput;
            where?: Prisma.CategoryWhereInput;
            orderBy?: Prisma.CategoryOrderByWithAggregationInput;
        }
    ) {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prisma.category.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where,
            orderBy,
        });
    }

    async update(
        where: Prisma.CategoryWhereUniqueInput,
        data: Prisma.CategoryUpdateInput
    ) {
        const _ = await this.findOne(where);

        return this.prisma.category.update({
            data,
            where,
        });
    }

    async delete(where: Prisma.CategoryWhereUniqueInput) {
        const _ = await this.findOne(where);

        return await this.prisma.category.delete({ where });
    }
}
