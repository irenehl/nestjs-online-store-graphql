import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import { SES } from '@aws-sdk/client-ses';

@Module({
    providers: [
        ConfigService,
        {
            provide: 'S3',
            useValue: new S3({ region: 'us-east-2' }),
        },
        {
            provide: 'SES',
            useValue: new SES({ region: 'us-east-2' }),
        },
    ],
    exports: ['S3', 'SES'],
})
export class AwsModule {}
