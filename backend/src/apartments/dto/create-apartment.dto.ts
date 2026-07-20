import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApartmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unitNumber!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  project!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  city!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  address!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  area!: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  beds!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  baths!: number;
}
