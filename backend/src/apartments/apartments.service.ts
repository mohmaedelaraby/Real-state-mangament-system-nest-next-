import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { QueryApartmentsDto } from './dto/query-apartments.dto';

@Injectable()
export class ApartmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async findAll(query: QueryApartmentsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const where: Prisma.ApartmentWhereInput = {};
    const filters: Prisma.ApartmentWhereInput[] = [];

    if (query.search) {
      filters.push({
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { unitNumber: { contains: query.search, mode: 'insensitive' } },
          { project: { contains: query.search, mode: 'insensitive' } },
        ],
      });
    }

    if (query.project) {
      filters.push({ project: { contains: query.project, mode: 'insensitive' } });
    }

    if (query.city) {
      filters.push({ city: { contains: query.city, mode: 'insensitive' } });
    }

    if (filters.length > 0) {
      where.AND = filters;
    }

    const [data, total] = await Promise.all([
      this.prisma.apartment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.apartment.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });
    if (!apartment) {
      throw new NotFoundException(`Apartment with id "${id}" not found`);
    }
    return apartment;
  }

  async create(dto: CreateApartmentDto, files: Express.Multer.File[]) {
    const images = files && files.length > 0 ? await this.storage.uploadFiles(files) : [];

    return this.prisma.apartment.create({
      data: {
        name: dto.name,
        unitNumber: dto.unitNumber,
        project: dto.project,
        city: dto.city,
        description: dto.description,
        address: dto.address,
        area: dto.area,
        price: dto.price,
        beds: dto.beds,
        baths: dto.baths,
        images,
      },
    });
  }
}
