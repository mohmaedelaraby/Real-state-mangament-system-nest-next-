import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { QueryApartmentsDto } from './dto/query-apartments.dto';
import { ApartmentsRepository } from './apartments.repository';

@Injectable()
export class ApartmentsService {
  constructor(
    private readonly apartmentsRepository: ApartmentsRepository,
  ) {}

  async findAll(query: QueryApartmentsDto) {
    return this.apartmentsRepository.findAll(query);
  }

  async findOne(id: string) {
    const apartment = await this.apartmentsRepository.findOne(id);
    if (!apartment) {
      throw new NotFoundException(`Apartment with id "${id}" not found`);
    }
    return apartment;

  }

  async create(dto: CreateApartmentDto, files: Express.Multer.File[]) {
    return this.apartmentsRepository.create(dto, files);
  }
}
