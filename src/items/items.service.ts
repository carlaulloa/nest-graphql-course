import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

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

  async findAll(user: User) {
    return this.itemsRepository.find({
      where: { user: { id: user.id } }
    });
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
}
