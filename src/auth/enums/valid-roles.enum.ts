import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {
  Admin = 'admin',
  User = 'user'
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles'
})