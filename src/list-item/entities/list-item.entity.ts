import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/list/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'listItems' })
export class ListItem {
  @Field(() => ID, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int, { description: 'Example field (placeholder)' })
  @Column({ type: 'numeric' })
  quantity: number;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItem, { 
    lazy: true
   })
  list: List;

  @ManyToOne(() => Item, (item) => item.listItem, { 
    lazy: true
   })
  item: Item;

}
