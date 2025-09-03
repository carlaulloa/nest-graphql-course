import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
  @Query(() => String)
  helloWorld(): string {
    return 'Hola';
  }

  @Query(() => Float, { name: 'randomNumber' })
  getRandomNumber(): number {
    return Math.random() * 100;
  }

  @Query(() => Int, { name: 'randomFromZeroTo', description: 'From zero to argument TO' })
  getRandomeFromZeroTo(
    @Args('to', { type: () => Int, nullable: true }) to: number = 6
  ): number {
    return Math.floor(Math.random() * to);
  }
}
