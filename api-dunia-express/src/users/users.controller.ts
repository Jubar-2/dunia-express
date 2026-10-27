import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto.js';
import { UsersService } from './users.service.js';
import { CheckAbilities } from '../casl/decorators/check-abilities.decorator.js';
import { Action } from '../casl/ability.factory.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create user' })
  @CheckAbilities({ action: Action.Manage, subject: 'all' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get current user profile (example protected endpoint)',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }
}
