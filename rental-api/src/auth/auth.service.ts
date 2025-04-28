import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { PermsDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  /**
   * Signing into admin panel
   * @param loginData - email and password of user that tries to log in
   * @returns JWT token
   */
  async signIn(loginData: LoginDto){
    const user = await this.usersService.findOne(loginData.email);

    if(!user || !await bcrypt.compare(loginData.password, user.password))
      throw new BadRequestException;
    
    const payload = { sub: user.id, email: user.email, permissions:  user.permissions };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(newUser: RegisterDto){
    if(!newUser.email || !newUser.password || await this.usersService.findOne(newUser.email))
      throw new BadRequestException;

    const user = await this.usersService.create({
        email: newUser.email, 
        password: await bcrypt.hash(newUser.password, 10), 
        permissions: PermsDto.U
      })

    const payload = { sub: user.id, email: user.email, permissions:  user.permissions };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
