import { ArrayMinSize, IsArray, IsEnum, IsOptional, IsString, validateSync } from "class-validator";
import { PlatformEnum } from "../enums/platform.entity";
import { v4 as uuidv4 } from 'uuid';

export class MessageSchema {

    readonly id: string

    @IsString()
    queue: string;

    @IsEnum(PlatformEnum)
    platform: PlatformEnum;

    @IsOptional()
    @IsString()
    subject?: string;

    @IsString()
    message: string;

    @IsString({ each: true })
    @IsArray()
    @ArrayMinSize(1)
    Recipients: string[]

    constructor(queue: string, platform: PlatformEnum, message: string, Recipients:string[] ,subject?: string) {
        this.queue = queue
        this.platform = platform
        this.message = message
        this.Recipients = Recipients
        this.subject = subject

        this.id = uuidv4();
        this.validate()
    }

    private validate(): void {
        const errors = validateSync(this);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }
}

