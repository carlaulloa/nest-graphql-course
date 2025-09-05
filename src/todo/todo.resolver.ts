import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';
import { StatusArgs } from './dto/args/status.args';
import { AggregationsType } from './types/aggregations.type';

@Resolver()
export class TodoResolver {

  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo], { name: 'todos' })
  findAll(
    @Args() statusArgs: StatusArgs
  ): Todo[] {
    return this.todoService.findAll(statusArgs);
  }

  @Query(() => Todo, { name: 'todo' })
  findOne(@Args('id', { type: () => Int }) id: string): any {
    return this.todoService.findOne(+id);
  }

  @Mutation(() => Todo, { name: 'createTodo' })
  create(
    @Args('createTodoInput') createTodoInput: CreateTodoInput
  ): any {
    console.log(createTodoInput)
    return this.todoService.create(createTodoInput)
  }

  @Mutation(() => Todo, { name: 'updateTodo' })
  update(
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput
  ): any {
    return this.todoService.update(updateTodoInput)
  }

  @Mutation(() => Boolean, { name: 'removeTodo' })
  remove(@Args('id', { type: () => Int }) id: number): boolean {
    return this.todoService.remove(id)
  }

  @Query(() => Int, { name: 'totalTodos' })
  totalTodos(): number {
    return this.todoService.totalTodos
  }

  @Query(() => Int, { name: 'completedTodos' })
  completedTodos(): number {
    return this.todoService.completedTodos
  }

  @Query(() => Int, { name: 'pendingTodos' })
  pendingTodos(): number {
    return this.todoService.pendingTodos
  }

  @Query(() => AggregationsType, { name: 'aggregations' })
  aggregations(): AggregationsType {
    return {
      total: this.todoService.totalTodos,
      completed: this.todoService.completedTodos,
      pending: this.todoService.pendingTodos,
      totalTodosCompleted: this.todoService.completedTodos
    }
  }
}
