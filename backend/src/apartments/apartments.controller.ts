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

  @Get()
  findAll(@Query() query: QueryApartmentsDto) {
    return this.apartmentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, { storage: memoryStorage() }))
  create(
    @Body() dto: CreateApartmentDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.apartmentsService.create(dto, images);
  }
}
