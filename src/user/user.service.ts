/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(private dbService: DbService) { }

  async register(registerUserDto: RegisterUserDto) {
    const users = await this.dbService.read();
    const findUser = users.find((user) => user.username === registerUserDto.username);
    if (findUser) {
      throw new BadRequestException('用户名已存在');
    }
    const user = new User();
    user.username = registerUserDto.username;
    user.password = registerUserDto.password;
    users.push(user);
    await this.dbService.write(users);
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read();
    const user = users.find((user) => user.username === loginUserDto.username);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (user.password !== loginUserDto.password) {
      throw new BadRequestException('密码错误');
    }
    return user;
  }
}
