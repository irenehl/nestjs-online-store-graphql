import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { SesService } from '@aws/ses.service';
import { PrismaService } from '@config/prisma.service';
import { createMockContext } from '@mocks/prisma.mock';
import { createSESMock } from '@mocks/ses.mock';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';

describe('UserResolver', () => {
    let resolver: UserResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserResolver,
                UserService,
                PrismaService,
                ConfigService,
                SesService,
            ],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .overrideProvider(SesService)
            .useValue(createSESMock())
            .compile();

        resolver = module.get<UserResolver>(UserResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
