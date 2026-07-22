import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/** Query params for `GET /apartments`. All fields optional; page/limit default via ApartmentsRepository#findAll. */
export class QueryApartmentsDto {
  /** Matches against name, unitNumber, or project (case-insensitive, partial). */
  @IsOptional()
  @IsString()
  search?: string;

  /** Filter by project (case-insensitive, partial match). */
  @IsOptional()
  @IsString()
  project?: string;

  /** Filter by city (case-insensitive, partial match). */
  @IsOptional()
  @IsString()
  city?: string;

  /** 1-indexed page number. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /** Page size, capped at 100 to prevent unbounded queries. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 12;
}
