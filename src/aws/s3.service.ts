import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    constructor(
        @Inject('S3') private s3: S3Client,
        private configService: ConfigService
    ) {}

    private buildKeyFromFileName(fileName: string) {
        return `${fileName}-${new Date().toISOString()}`;
    }

    async generatePresignedUrl(originalFileName: string) {
        const Key = this.buildKeyFromFileName(originalFileName);
        const command = new PutObjectCommand({
            Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
            Key,
        });

        return {
            uploadUrl: await getSignedUrl(this.s3 as any, command as any, {
                expiresIn: 3600,
            }),
            key: Key,
        };
    }
}
