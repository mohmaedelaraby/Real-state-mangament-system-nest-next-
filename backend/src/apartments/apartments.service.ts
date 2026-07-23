import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { QueryApartmentsDto } from './dto/query-apartments.dto';
import { ApartmentsRepository } from './apartments.repository';
import { StorageService } from '../storage/storage.service';

/**
 * Service layer for apartments, responsible for business logic and dealing with repository layer and storage service.
 */
@Injectable()
export class ApartmentsService {
  constructor(
    private readonly apartmentsRepository: ApartmentsRepository,
    private readonly storage: StorageService,
  ) {}

  /**  responsible for getting all apartments **/
  async findAll(query: QueryApartmentsDto) {
    return this.apartmentsRepository.findAll(query);
  }

  /**  responsible for getting a single apartment by id **/
  async findOne(id: string) {
    const apartment = await this.apartmentsRepository.findOne(id);
    if (!apartment) {
      /** Throw a 404 Not Found if the apartment doesn't exist */
      throw new NotFoundException(`Apartment with id "${id}" not found`);
    }
    return apartment;

  }

  /**  responsible for creating a new apartment **/
  async create(dto: CreateApartmentDto, files: Express.Multer.File[]) {
    const images = files && files.length > 0 ? await this.storage.uploadFiles(files) : [];
    return this.apartmentsRepository.create(dto, images);
  }
}
