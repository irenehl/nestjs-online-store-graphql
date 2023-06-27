import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@config/prisma.service';
import { S3Service } from '@aws/s3.service';
import { createS3Mock } from '@mocks/s3.mock';
import { createMockContext } from '@mocks/prisma.mock';
import { ConfigService } from '@nestjs/config';

describe('S3Service', () => {
    let service: S3Service;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [S3Service, ConfigService],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .overrideProvider(S3Service)
            .useValue(createS3Mock())
            .compile();

        service = module.get<S3Service>(S3Service);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
