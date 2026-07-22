import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { QueryApartmentsDto } from './dto/query-apartments.dto';
import { ApartmentsRepository } from './apartments.repository';
import { StorageService } from '../storage/storage.service';

/**
 * Business-rule layer for apartments: translates repository results into
 * HTTP-meaningful outcomes (e.g. `findOne` turns a missing row into a 404)
 * and is what the controller talks to. Query building and Prisma calls live
 * in `ApartmentsRepository`, not here. Also owns the "upload then persist"
 * orchestration for `create` — file storage is a separate concern from DB
 * access, so it's coordinated here rather than inside the repository.
 */
@Injectable()
export class ApartmentsService {
  constructor(
    private readonly apartmentsRepository: ApartmentsRepository,
    private readonly storage: StorageService,
  ) {}

  async findAll(query: QueryApartmentsDto) {
    return this.apartmentsRepository.findAll(query);
  }

  /** @throws NotFoundException if no apartment exists with the given id. */
  async findOne(id: string) {
    const apartment = await this.apartmentsRepository.findOne(id);
    if (!apartment) {
      throw new NotFoundException(`Apartment with id "${id}" not found`);
    }
    return apartment;

  }

  async create(dto: CreateApartmentDto, files: Express.Multer.File[]) {
    const images = files && files.length > 0 ? await this.storage.uploadFiles(files) : [];
    return this.apartmentsRepository.create(dto, images);
  }
}
