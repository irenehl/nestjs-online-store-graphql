import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type Context = {
    prisma: PrismaClient;
};

export type MockContext = DeepMockProxy<PrismaClient>;

export const createMockContext = () => mockDeep<PrismaClient>();
