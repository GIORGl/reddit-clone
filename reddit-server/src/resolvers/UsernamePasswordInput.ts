import {
  Field,
  InputType
} from "type-graphql";

// import session from "express-session";
@InputType()
export class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password: string;

  @Field()
  email: string;
}
