import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListService {

  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const list = this.listRepository.create({
      ...createListInput,
      user,
    });
    return this.listRepository.save(list);
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    
    const queryBuilder = this.listRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .andWhere('list.user = :user', { user: user.id });
    
    if (search) {
      queryBuilder.andWhere('LOWER("name") LIKE :search', { search: `%${search.toLowerCase()}%` })
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOne({where: { id, user: { id: user.id } } });
    if (!list) {
      throw new NotFoundException(`List with id "${id}" not found`);
    }
    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne(id, user);
    const updatedList = await this.listRepository.preload({
      ...updateListInput,
      user,
    });
    if (!updatedList) {
      throw new NotFoundException(`List with id "${id}" not found`);
    }
    return this.listRepository.save(updatedList);
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    await this.listRepository.remove(list);
    return { ...list, id };
  }

  async listCountByUser(user: User): Promise<number> {
    return this.listRepository.count({ where: { user: { id: user.id } } });
  }
}
