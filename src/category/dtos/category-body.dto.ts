import { IsString } from 'class-validator';

export class CategoryBodyDto {
    @IsString()
    name: string;
}
