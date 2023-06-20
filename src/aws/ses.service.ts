import { Inject, Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import { MailInfo } from './interfaces/mail-info.interface';
import { MailParams } from './interfaces/mail-params.interface';

@Injectable()
export class SesService {
    constructor(
        @Inject('SES') private sesClient: SESClient,
        private configService: ConfigService
    ) {}

    private createParams(mailParams: MailParams) {
        return {
            Destination: {
                ToAddresses: mailParams.toAddresses,
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: mailParams.htmlData,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: mailParams.subject,
                },
            },
            Source: mailParams.source,
        };
    }

    async sendEmail({
        htmlTemplate,
        subject,
        toAddresses,
        textReplacer,
    }: MailInfo) {
        const htmlData = textReplacer(htmlTemplate);
        const mailParams = this.createParams({
            toAddresses,
            htmlData,
            subject,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            source: this.configService.get<string>('MAIL_IDENTITY')!,
        });

        return this.sesClient.send(new SendEmailCommand(mailParams));
    }
}
