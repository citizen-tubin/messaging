export interface IMedia {

    recipient: string;

    message: string;

    subject?: string;

    send(): void;

    validate(): void;
}