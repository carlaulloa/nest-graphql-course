import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: 'Aggregations' })
export class AggregationsType {
  @Field(() => Int, { description: 'Total todos' })
  total: number;
  @Field(() => Int, { description: 'Completed todos' })
  completed: number;
  @Field(() => Int, { description: 'Pending todos' })
  pending: number;
  @Field(() => Int, { description: 'Pending todos', deprecationReason: 'Use completed instead' })
  totalTodosCompleted: number;
}