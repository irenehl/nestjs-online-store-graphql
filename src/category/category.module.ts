import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PrismaService } from '@config/prisma.service';
import { CategoryResolver } from './category.resolver';

@Module({
    providers: [CategoryService, PrismaService, CategoryResolver],
})
export class CategoryModule {}
