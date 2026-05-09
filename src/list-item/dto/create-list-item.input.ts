import { InputType, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Min, IsNumber, IsUUID } from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => ID)
  @IsUUID()
  itemId: string;

  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => Number, { nullable: true })
  @Min(0)
  @IsNumber()
  @IsOptional()
  quantity: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;
}
