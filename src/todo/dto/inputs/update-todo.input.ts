import { Field, InputType, Int } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

@InputType()
export class UpdateTodoInput {

  @Field(() => Int, { description: 'Task id' })
  @IsInt()
  id: number;

  @Field(() => String, { description: 'Task name', nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  description?: string;    

  @Field(() => Boolean, { description: 'Task status', nullable: true })
  @IsOptional()
  @IsBoolean()
  done?: boolean;

}
