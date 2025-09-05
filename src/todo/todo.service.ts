import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';
import { StatusArgs } from './dto/args/status.args';

@Injectable()
export class TodoService {

  private todos: Todo[] = [
    { id: 1, description: 'A', done: false },
    { id: 2, description: 'B', done: false },
    { id: 3, description: 'C', done: false },
  ];

  findAll(statusArgs: StatusArgs): Todo[] {
    if (statusArgs.done) {
      return this.todos.filter(todo => todo.done === statusArgs.done);
    }
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find(todo => todo.id === id)
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  create(createTodoInput: CreateTodoInput): Todo {
    const todo = new Todo()
    todo.description = createTodoInput.description
    todo.id = this.todos.length + 1
    this.todos.push(todo);
    return todo;
  }

  update(updateTodoInput: UpdateTodoInput): Todo {
    const todo = this.findOne(updateTodoInput.id)
    todo.description = updateTodoInput.description ?? todo.description
    todo.done = updateTodoInput.done ?? todo.done
    return todo
  }

  remove(id: number): boolean {
    const todo = this.findOne(id)
    this.todos = this.todos.filter(todo => todo.id !== id)
    return true
  }

  get totalTodos(): number {
    return this.todos.length
  }

  get completedTodos(): number {
    return this.todos.filter(todo => todo.done).length
  }

  get pendingTodos(): number {
    return this.todos.filter(todo => !todo.done).length
  }
}
