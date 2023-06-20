export interface MailInfo {
    htmlTemplate: string;
    subject: string;
    toAddresses: string[];
    textReplacer: (html: string) => string;
}
