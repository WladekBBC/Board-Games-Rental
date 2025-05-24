import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoggedUserDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { jwtConstants } from './contstants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  /**
   * Signing into admin panel
   * @param loginData - email and password of user that tries to log in
   * @returns JWT token and permissions of logged user
   */
  async signIn(loginData: LoginDto): Promise<LoggedUserDto>{
    if(!loginData)
      throw new BadRequestException;
    const user = await this.usersService.findOne(loginData.email);

    if(!user || !await bcrypt.compare(loginData.password, user.password))
      throw new BadRequestException;
    
    const payload = { id: user.id, email: user.email, permissions:  user.permissions };
    return {
      token: this.jwtService.sign(payload, {secret: jwtConstants.secret, expiresIn: '30 days'}),
    };
  }

  /**
   * Registering new user
   * @param newUser - new user data
   * @returns JWT token and permissions of new User
   */
  async register(newUser: RegisterDto): Promise<LoggedUserDto>{
    if(!newUser.email || !newUser.password || await this.usersService.findOne(newUser.email))
      throw new BadRequestException;

    const user = await this.usersService.create({
        email: newUser.email, 
        password: await bcrypt.hash(newUser.password, 10), 
      })

    const payload = { id: user.id, email: user.email, permissions: user.permissions};
    return {
      token: this.jwtService.sign(payload, {secret: jwtConstants.secret, expiresIn: '30 days'})
    };
  }
}
