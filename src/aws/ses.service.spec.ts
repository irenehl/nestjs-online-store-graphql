import { Test, TestingModule } from '@nestjs/testing';
import { SesService } from './ses.service';
import { createSESMock } from '@mocks/ses.mock';
import { ConfigService } from '@nestjs/config';

describe('SesService', () => {
    let service: SesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SesService, ConfigService],
        })
            .overrideProvider(SesService)
            .useValue(createSESMock())
            .compile();

        service = module.get<SesService>(SesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
