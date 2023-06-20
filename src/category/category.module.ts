import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from '@config/prisma.service';

@Module({
    providers: [CategoryService, PrismaService],
    controllers: [CategoryController],
})
export class CategoryModule {}
