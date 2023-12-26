import { IsNotEmpty, validateSync } from "class-validator";
import { IMedia } from "../interfaces/IMedia";

export class Sms implements IMedia {

    @IsNotEmpty()
    recipient: string;

    @IsNotEmpty()
    message: string;

    constructor(recipient: string, message: string, ) {
        this.recipient = recipient;
        this.message = message;

        this.validate()
    }

    send(): void {
        if (this.recipient.length !==10) {
            console.error(`Failed to send message to number ${this.recipient}`);
        }
        console.log(`Sending message to ${this.recipient} with message ${this.message}`);
    }

    validate(): void {
        const errors = validateSync(this);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }
}
