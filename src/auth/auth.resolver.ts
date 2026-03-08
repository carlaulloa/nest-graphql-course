import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/inputs/signup.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => String, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<any> {
    return this.authService.signup(signupInput)
  }
/*
  @Mutation(() => String, { name: 'login' })
  async login(): Promise<any> {
    return this.authService.login()
  }

  @Query(, { name: 'revalidate' })
  async revalidateToken() {
    return this.authService.revalidateToken()
  }*/
}
