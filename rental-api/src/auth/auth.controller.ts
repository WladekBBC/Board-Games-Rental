import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Param } from '@nestjs/common';
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
  @Permission(Perms.A || Perms.R)
  @Get('users')
  getUsers() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  // @Permission(Perms.A)
  @Get('user/:id')
  getUser(@Param() id:number) {
    return this.userService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @Permission(Perms.A)
  @Get('update/:id')
  editUser(@Param() id:number, @Body() updateUser: UpdateUserDto ) {
    return this.userService.update(id, updateUser);
  }

  @UseGuards(AuthGuard)
  @Permission(Perms.A)
  @Get('delete/:id')
  deleteUser(@Param() id:number ) {
    return this.userService.remove(id);
  }
}
