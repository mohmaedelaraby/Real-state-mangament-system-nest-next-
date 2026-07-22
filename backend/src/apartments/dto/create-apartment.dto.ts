import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Body shape for `POST /apartments`, sent as `multipart/form-data` (all these
 * fields as text parts, plus an `images` file field handled separately by
 * `FilesInterceptor` — see ApartmentsController#create). `@Type(() => Number)`
 * is required on the numeric fields because multipart text values arrive as
 * strings; `class-transformer` coerces them before `class-validator` runs.
 */
export class CreateApartmentDto {
  /** Display name, e.g. "Sea-view Chalet". */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  /** Unit/apartment number within the project, e.g. "CH-204". */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unitNumber!: string;

  /** Compound/development name, e.g. "Marassi". Matched by the `project` list filter. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  project!: string;

  /** City, e.g. "North Coast". Matched by the `city` list filter. */
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

  /** Floor area in square meters. */
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  area!: number;

  /** Listing price in EGP. */
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
