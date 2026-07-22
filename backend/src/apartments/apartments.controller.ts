import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImageUploadInterceptor } from '../common/interceptors/image-upload.interceptor';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { QueryApartmentsDto } from './dto/query-apartments.dto';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  /**
   * GET /apartments
   * Paginated, filtered listing. All query params are optional.
   * @param query search/project/city filters + page/limit (validated & defaulted by QueryApartmentsDto)
   * @returns { data: Apartment[], total: number, page: number, limit: number }
   */
  @Get()
  findAll(@Query() query: QueryApartmentsDto) {
    return this.apartmentsService.findAll(query);
  }

  /**
   * GET /apartments/:id
   * @returns the apartment, or a 404 if `id` doesn't match any row.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(id);
  }

  /**
   * POST /apartments
   * multipart/form-data: text fields per CreateApartmentDto + up to 10 image
   * ImageUploadInterceptor for the upload/validation rules.
   * @returns the created apartment (201), including public image URLs.
   */
  @Post()
  @UseInterceptors(ImageUploadInterceptor('images', 10))
  create(
    @Body() dto: CreateApartmentDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.apartmentsService.create(dto, images);
  }
}
