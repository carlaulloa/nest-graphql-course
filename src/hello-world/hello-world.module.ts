import { Module } from '@nestjs/common';
import { HelloWorldResolver } from './helloworld.resolver';

@Module({
  providers: [HelloWorldResolver],
})
export class HelloWorldModule {}
