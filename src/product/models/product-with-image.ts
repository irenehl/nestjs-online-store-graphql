import { Product } from '@prisma/client';

export type ProductWithImage = Product & { uploadUrl: string };
