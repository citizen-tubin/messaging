import { IsNotEmpty, validateSync } from "class-validator";
import { IMedia } from "../interfaces/IMedia";

export class Email implements IMedia {

    @IsNotEmpty()
    recipient: string;

    message: string;

    subject: string;


    constructor(recipient: string, subject: string, message: string) {
        this.recipient = recipient;
        this.subject = subject;
        this.message = message;
    
        this.validate()
    }

    send(): void {
        if (!this.validateEmail(this.recipient)) {
            console.error(`Invalid recipient  ${this.recipient}. Failed to send mail.`);
        }
        else if (!this.message && !this.subject) {
            console.warn(`Sending email to ${this.recipient} without subject or text in the body.`);

        }
        else {
            console.log(`Sending email to ${this.recipient} with subject "${this.subject}" and message: ${this.message}`);
        }
    }
    

    validate(): void {
        const errors = validateSync(this);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }

    private validateEmail(email: string): boolean {
        const emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        return emailRegex.test(email);
    }
}
