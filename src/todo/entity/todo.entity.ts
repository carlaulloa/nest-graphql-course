import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Todo {
  @Field(() => Int, { description: 'ID of todo' })
  id: number;
  @Field(() => String)
  description: string;
  @Field(() => Boolean)
  done: boolean = false;
}