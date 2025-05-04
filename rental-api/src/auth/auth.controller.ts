import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Param, Delete, Patch, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserService } from 'src/user/user.service';
import { Permission } from 'src/decorators/permissions.decorator';
import { Perms } from 'src/enums/permissions.enum';
import { UpdateUserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  /**
   * Signin controller
   * @param signInDto - data to log in, email and password
   * @returns token and permissions of logged user
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto);
  }

  /**
   * Register controller
   * @param registerDto - email and password to create new user
   * @returns token and permissions of new user
   */
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * User list getter
   * @returns User list
   */
  @UseGuards(AuthGuard)
  @Permission([Perms.A, Perms.R])
  @Get('users')
  getUsers() {
    return this.userService.findAll();
  }

  /**
   * User getter
   * @param id - id number of user
   * @returns user
   */
  @UseGuards(AuthGuard)
  @Get('user/:id')
  getUser(@Param('id') id:number, @Headers() headers: Record <string, string> ) {
    return this.userService.findOneById(id, headers.permissions, headers.token);
  }

  /**
   * Edit User
   * @param id - id of edited user
   * @param updateUser - updated data
   * @returns state of edit
   */
  @UseGuards(AuthGuard)
  @Patch('update/:id')
  editUser(@Param('id') id:number, @Headers() headers: Record <string, string>, @Body() updateUser: UpdateUserDto ) {
    return this.userService.update(id, headers.permissions, headers.token, updateUser);
  }

  /**
   * Deleting user
   * @param id - id of deleted user
   * @returns state of delete
   */
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  deleteUser(@Param('id') id:number, @Headers() headers: Record <string, string> ) {
    return this.userService.remove(id, headers.permissions, headers.token);
  }
}
