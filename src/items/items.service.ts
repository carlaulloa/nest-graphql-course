import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ) {}

  async create(createItemInput: CreateItemInput, user: User) {
    const item = this.itemsRepository.create({ ...createItemInput, user });
    return this.itemsRepository.save(item);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs) {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    
    /*return this.itemsRepository.find({
      take: limit,
      skip: offset,
      where: { 
        user: { 
          id: user.id 
        }, 
        name: Like(`%${ search }%`)
      } 
    });*/

    const queryBuilder = this.itemsRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER("name") LIKE :search', { search: `%${search.toLowerCase()}%` })
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOne({
      where: { 
        id, 
        user: { id: user.id } 
      } 
    });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOne(id, user);
    const item = await this.itemsRepository.preload(updateItemInput);
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.itemsRepository.remove(item);
    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({
      where: { user: { id: user.id } }
    })
  }
}
