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
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
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
   * multipart/form-data: text fields per CreateApartmentDto + up to 10 files
   * under the `images` field. Images are buffered in memory (not written to
   * local disk) and streamed straight to MinIO — see StorageService.
   * @returns the created apartment (201), including public image URLs.
   */
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, { storage: memoryStorage() }))
  create(
    @Body() dto: CreateApartmentDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.apartmentsService.create(dto, images);
  }
}
