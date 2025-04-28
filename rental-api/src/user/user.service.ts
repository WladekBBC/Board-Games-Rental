import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
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
  async findOneById(id:number, perms: string){
    if(await this.checkPerms(id, perms))
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
  async update(id: number, perms: string, updateUserDto: UpdateUserDto) {
    if(await this.checkPerms(id, perms))
      return this.userRepo.update(id, updateUserDto)
    throw new UnauthorizedException
  }

  /**
   * Removing user
   * @param id - id of user to delete
   * @param perms - permissions from request
   * @returns result of deleting user
   */
  async remove(id: number, perms: string) {
    if(await this.checkPerms(id, perms))
      return this.userRepo.delete(id)
    throw new UnauthorizedException
  }

  /**
   * Permission Checker
   * @param id - index number of user
   * @param perms - permission from request
   * @returns boolean if user's permissions are equal
   */
  async checkPerms(id: number, perms: string): Promise<boolean>{
    return this.userRepo.findOneBy({ id }).then( user => user?.permissions == perms)
  }
}
