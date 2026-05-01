import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) { }

  @Mutation(() => Boolean, {
    name: 'executeSeed',
    description: 'Ejecuta el seed para cargar datos iniciales',
  })
  async executeSeed(): Promise<boolean> {
    return this.seedService.executeSeed();
  }
}
