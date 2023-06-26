import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from '@config/prisma.service';
import { CategoryResolver } from './category.resolver';

@Module({
    providers: [CategoryService, PrismaService, CategoryResolver],
    controllers: [CategoryController],
})
export class CategoryModule {}
