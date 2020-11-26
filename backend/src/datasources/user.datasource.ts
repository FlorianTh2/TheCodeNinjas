import { DataSource } from "apollo-datasource";
import User from "../entities/user.entity";
import { users } from "../seed-data";
import * as uuid from "uuid";
import * as bcrypt from "bcrypt";

export default class UserDatasource extends DataSource {
  users: User[];

  constructor() {
    super();

    this.users = users;
  }

  getUsers(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  getUser(id: string): Promise<User> {
    return Promise.resolve(this.users.find((user) => user.id === id));
  }

  getUserByEmail(email: string): Promise<User> {
    return Promise.resolve(this.users.find((user) => user.email === email));
  }

  async createUser(user: Partial<User>, password: string): Promise<User> {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: uuid.v4(),
      name: user.name,
      email: user.email,
      passwordHash: hash,
      passwordSalt: salt,
    };

    this.users = [...this.users, newUser];

    return Promise.resolve(newUser);
  }
}
