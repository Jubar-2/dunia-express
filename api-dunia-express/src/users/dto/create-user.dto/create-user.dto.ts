import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  // @Transform(({ value }: { value: unknown }) =>
  //     typeof value === 'string' ? value.trim().toLowerCase() : value,
  // )

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(25)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsUUID()
  @IsOptional()
  roll?: string;
}
