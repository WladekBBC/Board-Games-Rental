import { Injectable } from '@nestjs/common';
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
}
