import { S3Client } from '@aws-sdk/client-s3';
import { S3Service } from '@aws/s3.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type Context = {
    s3: S3Client;
};

export type S3MockContext = DeepMockProxy<S3Service>;

export const createS3Mock = () => mockDeep<S3Client>();
