import { User } from '../../database/schema/index.js';

export interface UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function sanitizeUser(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    avatarUrl: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
