import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { Permission } from '../decorators/permissions.decorator';
import { Perms } from '../enums/permissions.enum';
import { UpdateUserDto } from './dto/user.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Permission([Perms.A])
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Permission([Perms.A])
  async getUserById(
    @Param('id') id: number,
    @Headers() headers: Record<string, string>
  ) {
    return this.userService.findOneById(id, headers.permissions);
  }

  @Put(':id')
  @Permission([Perms.A])
  async updateUser(
    @Param('id') id: number,
    @Headers() headers: Record<string, string>,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, headers.permissions, updateUserDto);
  }

  @Delete(':id')
  @Permission([Perms.A])
  async deleteUser(
    @Param('id') id: number,
    @Headers() headers: Record<string, string>
  ) {
    return this.userService.remove(id, headers.permissions);
  }
} 