import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException('User with specified id wasnt found');

    return user;
  }

  async findOneWithRelations(id: number): Promise<User> {
    const findOptions: FindManyOptions<User> = {
      where: { id },
      relations: {
        routines: true,
        days: true,
        goals: true,
        rules: true,
      },
    };

    const user = await this.userRepository.findOne(findOptions);
    if (!user)
      throw new NotFoundException('User with specified id wasnt found');

    return user;
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    const findOptions: FindManyOptions<User> = {
      relations: {
        routines: true,
        days: true,
        goals: true,
        rules: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] = await this.userRepository.findAndCount(findOptions);
    return { data, total };
  }

  async findBysuperTokenId(supertoken_id: string) {
    return await this.userRepository.findOne({ where: { supertoken_id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    const updated = await this.userRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`User with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.delete(id);
    return user;
  }
}
