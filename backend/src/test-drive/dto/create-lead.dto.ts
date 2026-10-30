import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 30)
  phone: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  modelSlug: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  dealerId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  preferredDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  preferredTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
