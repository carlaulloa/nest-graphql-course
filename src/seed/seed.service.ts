import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/list/entities/list.entity';
import { ListService } from 'src/list/list.service';
import { ListItemService } from 'src/list-item/list-item.service';

@Injectable()
export class SeedService {

  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    private readonly userService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listService: ListService,
    private readonly listItemService: ListItemService
  ){
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException('Seed is only available in development mode');
    }

    await this.deleteDatabase();

    const user = await this.loadUsers();

    await this.loadItems(user);

    const list = await this.loadLists(user);

    const items = await this.itemsService.findAll(user, { limit: 15 }, {  });

    await this.loadListItems(list, items);
    return true;
  }

  async deleteDatabase(){
    await this.listItemRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.listRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.itemsRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.usersRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users: User[] = [];

    for (const user of SEED_USERS) {
      users.push(await this.userService.create(user));
    }

    return users[0]
  }

  async loadItems(user: User): Promise<void> {
    const items: Item[] = [];

    for (const item of SEED_ITEMS) {
      items.push(
        await this.itemsService.create(item as any, user)
      );
    }
  }

  async loadLists(user: User): Promise<List> {
      const lists: List[] = [];
      for (const list of SEED_LISTS) {
        lists.push(
          await this.listService.create(list, user)
        );
      }
      return lists[0];
  }

  async loadListItems(list: List, items: Item[]): Promise<void> {
    for (const item of items) {
      await this.listItemService.create({
        listId: list.id,
        itemId: item.id,
        quantity: Math.floor(Math.random() * 10) + 1,
        completed: Math.round(Math.random() * 1) === 1
      });
    }
  }
}
