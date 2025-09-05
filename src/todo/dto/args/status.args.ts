import { ArgsType, Field } from "@nestjs/graphql";
import { IsBoolean, IsOptional } from "class-validator";

@ArgsType()
export class StatusArgs {
    @Field(() => Boolean, { description: 'Task status', nullable: true })
    @IsOptional()
    @IsBoolean()
    done?: boolean;
}