import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryApartmentsDto {
  // Matches against name, unitNumber, or project (case-insensitive, partial)
  @IsOptional()
  @IsString()
  search?: string;

  // Filter by project (case-insensitive, partial match)
  @IsOptional()
  @IsString()
  project?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 12;
}
