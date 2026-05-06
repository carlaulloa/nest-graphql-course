import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ItemsModule } from 'src/items/items.module';
import { ListModule } from 'src/list/list.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    ItemsModule,
    ListModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
