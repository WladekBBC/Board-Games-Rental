import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { convertPerms, Perms } from '../enums/permissions.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService
  ){}
  
  /**
   * Creating new user
   * @param createUserDto - email, hashed password and perms of new user
   * @returns new user data
   */
  async create(createUserDto: CreateUserDto) {
    return this.userRepo.save(createUserDto)
  }

  /**
   * Getter for user list
   * @returns user list
   */
  async findAll() {
    return this.userRepo.find()
  }

  /**
   * Getting one user
   * @param email - email of searched user
   * @returns found user
   */
  async findOne(email: string) {
    return this.userRepo.findOneBy({ email })
  }

  /**
   * Getting one user by id
   * @param id - id number of number
   * @param perms - permissions from request
   * @returns found user
   */
  async findOneById(id:number, perms: string, jwt: string){
    if(await this.checkPerms(id, jwt) || convertPerms(perms) == Perms.A)
      return this.userRepo.findOneBy({ id })
    throw new UnauthorizedException
  }

  /**
   * Updating user
   * @param id - id of user to update
   * @param perms - permissions from request
   * @param updateUserDto - data of user to update
   * @returns result of updating user
   */
  async update(id: number, perms: string, jwt: string, updateUserDto: UpdateUserDto) {
    if(await this.checkPerms(id, jwt) || convertPerms(perms) == Perms.A)
      return this.userRepo.update(id, updateUserDto)
    throw new UnauthorizedException
  }

  /**
   * Removing user
   * @param id - id of user to delete
   * @param perms - permissions from request
   * @returns result of deleting user
   */
  async remove(id: number, perms: string, jwt: string) {
    if(await this.checkPerms(id, jwt) || convertPerms(perms) == Perms.A)
      return this.userRepo.delete(id)
    throw new UnauthorizedException
  }

  /**
   * Permission Checker
   * @param id - index number of user
   * @param jwt - jwt token to check id of sender
   * @returns boolean if user's ids are equal
   */
  checkPerms(id: number, jwt: string): boolean{
    const user = this.jwtService.decode(jwt);
    return id == user.id
  }

  async createAdminIfNotExists() {
    const adminEmail = 'admin@example.com';
    const adminPassword = '123456';
    const adminUser = await this.findOne(adminEmail);
    
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await this.create({
        email: adminEmail,
        password: hashedPassword,
        permissions: convertPerms(Perms.A)
      });
    }
  }
}
