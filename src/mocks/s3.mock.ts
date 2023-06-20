import { S3Client } from '@aws-sdk/client-s3';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type Context = {
    s3: S3Client;
};

export type S3MockContext = DeepMockProxy<S3Client>;

export const createS3Mock = () => mockDeep<S3Client>();
