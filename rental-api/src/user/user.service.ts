import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { Perms } from '../enums/permissions.enum';
import { OnModuleInit } from '@nestjs/common';
import { config } from 'src/env';

@Injectable()
export class UserService implements OnModuleInit{
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>){}
  
  async onModuleInit() {
    await this.createAdminIfNotExists()
  }

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
   * @returns found user
   */
  async findOneById(id:number){
    return this.userRepo.findOneBy({ id })
  }

  /**
   * Updating user
   * @param id - id of user to update
   * @param updateUserDto - data of user to update
   * @returns result of updating user
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.userRepo.update(id, updateUserDto)
  }

  /**
   * Removing user
   * @param id - id of user to delete
   * @returns result of deleting user
   */
  async remove(id: number) {
    return this.userRepo.delete(id)
  }


  async createAdminIfNotExists() {
    const adminUser = await this.findOne(config.AD_EMAIL);
    
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(config.AD_PASS, 10);
      await this.create({
        email: config.AD_EMAIL,
        password: hashedPassword,
        permissions: Perms.A
      });
    }
  }
}
