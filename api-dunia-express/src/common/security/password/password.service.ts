import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async comparePassword(password: string, password1: any) {
    return bcrypt.compare(password, password1);
  }
  private readonly saltRounds = Number(process.env.SALT_ROUNDS) || 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
