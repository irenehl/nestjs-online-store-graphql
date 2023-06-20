import { Category } from '@prisma/client';

export class CategoryDto {
    id: number;
    name: string;

    static toDto(category: CategoryDto): Category {
        return {
            id: category.id,
            name: category.name,
        };
    }
}
