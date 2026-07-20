import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const apartments = [
  {
    name: 'Maple Residence 3B',
    unitNumber: '3B',
    project: 'Maple Heights',
    description: 'A bright 2-bedroom unit with a spacious balcony overlooking the courtyard garden.',
    address: '12 Maple Street, New Cairo',
    area: 120.5,
    images: [],
  },
  {
    name: 'Palm View 7A',
    unitNumber: '7A',
    project: 'Palm Gardens',
    description: 'Corner unit with panoramic views and floor-to-ceiling windows in the living room.',
    address: '45 Palm Avenue, Sheikh Zayed',
    area: 145.0,
    images: [],
  },
  {
    name: 'Cedar Loft 12',
    unitNumber: '12',
    project: 'Cedar Towers',
    description: 'Modern loft-style apartment with an open-plan kitchen and high ceilings.',
    address: '8 Cedar Road, Zamalek',
    area: 98.2,
    images: [],
  },
  {
    name: 'Oak Suite 5D',
    unitNumber: '5D',
    project: 'Oakwood Residences',
    description: 'Family-friendly 3-bedroom apartment close to schools and parks.',
    address: '21 Oak Lane, Maadi',
    area: 175.8,
    images: [],
  },
  {
    name: 'Willow Flat 2C',
    unitNumber: '2C',
    project: 'Willow Court',
    description: 'Cozy ground-floor apartment with private garden access.',
    address: '3 Willow Close, Nasr City',
    area: 85.0,
    images: [],
  },
  {
    name: 'Birch Penthouse 20',
    unitNumber: '20',
    project: 'Birch Tower',
    description: 'Top-floor penthouse with a private rooftop terrace and skyline views.',
    address: '100 Birch Boulevard, New Capital',
    area: 260.0,
    images: [],
  },
  {
    name: 'Elm Studio 1A',
    unitNumber: '1A',
    project: 'Elm Court',
    description: 'Compact studio ideal for young professionals, fully furnished.',
    address: '9 Elm Street, Downtown',
    area: 55.4,
    images: [],
  },
  {
    name: 'Pine Residence 9F',
    unitNumber: '9F',
    project: 'Pine Ridge',
    description: 'Quiet unit on the top floor with mountain views and a modern kitchen.',
    address: '17 Pine Way, 6th of October',
    area: 132.3,
    images: [],
  },
  {
    name: 'Aspen Villa Unit 4',
    unitNumber: '4',
    project: 'Aspen Villas',
    description: 'Duplex unit with private entrance and small backyard, great for families.',
    address: '5 Aspen Court, New Cairo',
    area: 210.0,
    images: [],
  },
  {
    name: 'Sequoia Flat 15B',
    unitNumber: '15B',
    project: 'Sequoia Heights',
    description: 'Spacious 2-bedroom with a large balcony and dedicated parking spot.',
    address: '30 Sequoia Street, Heliopolis',
    area: 110.7,
    images: [],
  },
];

async function main() {
  const existing = await prisma.apartment.count();
  if (existing > 0) {
    console.log(`Skipping seed: ${existing} apartments already present.`);
    return;
  }

  console.log('Seeding apartments...');
  for (const apartment of apartments) {
    await prisma.apartment.create({ data: apartment });
  }
  console.log(`Seeded ${apartments.length} apartments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
