import { ArrayMinSize, IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { PlatformEnum } from "../enums/platform.entity";

export class MessageDto {

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
}




