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
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ImageUploadInterceptor } from '../common/interceptors/image-upload.interceptor';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { QueryApartmentsDto } from './dto/query-apartments.dto';
@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  /** GET /apartments - get all apartments, optionally filtered by query params (see QueryApartmentsDto) **/
  @Get()
  @ResponseMessage('success')
  findAll(@Query() query: QueryApartmentsDto) {
    return this.apartmentsService.findAll(query);
  }

  /** GET /apartments/:id -- get apartment details by id **/
  @Get(':id')
  @ResponseMessage('success')
  findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(id);
  }

  /** POST /apartments  - create a new apartment **/
  @Post()
  @ResponseMessage(' created successfully')
  @UseInterceptors(ImageUploadInterceptor('images', 10))
  create(
    @Body() dto: CreateApartmentDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.apartmentsService.create(dto, images);
  }
}
