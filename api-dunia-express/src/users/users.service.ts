import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto.js';
import { UsersRepository } from './users.repository.js';
import { PasswordService } from '../common/security/password/password.service.js';
import { DRIZZLE, type DrizzleDB } from '../database/database.constants.js';
import { users } from '../database/schema/index.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  async create(data: CreateUserDto) {
    console.log('Creating user with data:', data);
    const existing = await this.usersRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );

    const normalizedData = {
      ...data,
      email: data.email.trim().toLowerCase(),
      password: hashedPassword,
    };

    const user = await this.db.transaction(async (tx) => {
      return tx.insert(users).values(normalizedData).returning();
    });

    // Implement the logic to create a user in the database
    return user;
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new ConflictException('User not found');
    }
    const { sanitizeUser } = await import('./dto/user-response.dto.js');
    return sanitizeUser(user);
  }
}
