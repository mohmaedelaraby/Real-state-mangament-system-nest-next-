import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { QueryApartmentsDto } from "./dto/query-apartments.dto";
import { CreateApartmentDto } from "./dto/create-apartment.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ApartmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Paginated, filtered apartment list. `search` matches `name`, `unitNumber`,
   * or `project` (OR'd together); `project`/`city` narrow further (AND'd with
   * search).
   **/
  async findAll(query: QueryApartmentsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const where: Prisma.ApartmentWhereInput = {};
    const filters: Prisma.ApartmentWhereInput[] = [];

    if (query.search) {
      filters.push({
        OR: [
          { name: { contains: query.search, mode: "insensitive" } },
          { unitNumber: { contains: query.search, mode: "insensitive" } },
          { project: { contains: query.search, mode: "insensitive" } },
        ],
      });
    }

    if (query.project) {
      filters.push({
        project: { contains: query.project, mode: "insensitive" },
      });
    }

    if (query.city) {
      filters.push({ city: { contains: query.city, mode: "insensitive" } });
    }

    if (filters.length > 0) {
      where.AND = filters;
    }

    const [data, total] = await Promise.all([
      this.prisma.apartment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.apartment.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /** Returns `null` when not found — the 404 decision belongs to the service, not here. */
  async findOne(id: string) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });
    return apartment;
  }

  /** Persists a row with already-uploaded image URLs. Uploading is the caller's (service's) job. */
  async create(dto: CreateApartmentDto, images: string[]) {
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
