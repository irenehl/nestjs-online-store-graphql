import { SESClient } from '@aws-sdk/client-ses';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type Context = {
    s3: SESClient;
};

export type SESMockContext = DeepMockProxy<SESClient>;

export const createSESMock = () => mockDeep<SESClient>();
