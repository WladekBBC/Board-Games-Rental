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
  
  async create(createUserDto: CreateUserDto) {
    return this.userRepo.save(createUserDto)
  }

  async findAll() {
    return this.userRepo.find()
  }

  async findOne(email: string) {
    return this.userRepo.findOneBy({ email })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto)
  }

  async remove(id: number) {
    return this.userRepo.delete(id)
  }
}
