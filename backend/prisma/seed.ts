import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const apartments = [
  {
    name: 'Sea-view Chalet',
    unitNumber: 'CH-204',
    project: 'Marassi',
    city: 'North Coast',
    address: 'North Coast, Egypt',
    area: 145,
    price: 4200000,
    beds: 2,
    baths: 2,
    description:
      'Fully finished chalet steps from the lagoon with an unobstructed sea view and a wraparound terrace.',
    images: [],
  },
  {
    name: 'Garden Townhouse',
    unitNumber: 'TH-11B',
    project: 'Palm Hills',
    city: 'Sheikh Zayed',
    address: 'Sheikh Zayed, Egypt',
    area: 210,
    price: 7800000,
    beds: 3,
    baths: 3,
    description:
      'Corner townhouse opening onto a private garden, double-height living space and a rooftop lounge.',
    images: [],
  },
  {
    name: 'Skyline Penthouse',
    unitNumber: 'PH-30',
    project: 'ZED East',
    city: 'New Cairo',
    address: 'New Cairo, Egypt',
    area: 320,
    price: 15400000,
    beds: 4,
    baths: 4,
    description:
      'Top-floor penthouse with panoramic skyline views, private plunge pool and smart-home wiring throughout.',
    images: [],
  },
  {
    name: 'Lagoon Studio',
    unitNumber: 'ST-07',
    project: 'Hyde Park',
    city: 'New Cairo',
    address: 'New Cairo, Egypt',
    area: 68,
    price: 2350000,
    beds: 1,
    baths: 1,
    description:
      'Efficient studio loft overlooking the central lagoon, ideal as a starter home or rental unit.',
    images: [],
  },
  {
    name: 'Park Duplex',
    unitNumber: 'DX-15',
    project: 'Mivida',
    city: 'New Cairo',
    address: 'New Cairo, Egypt',
    area: 245,
    price: 9200000,
    beds: 3,
    baths: 4,
    description:
      'Split-level duplex with a mezzanine study, large windows and direct access to the linear park.',
    images: [],
  },
  {
    name: 'Marina Apartment',
    unitNumber: 'AP-118',
    project: 'Marassi',
    city: 'North Coast',
    address: 'North Coast, Egypt',
    area: 132,
    price: 5100000,
    beds: 2,
    baths: 2,
    description:
      'Bright two-bed apartment in the marina district with a generous balcony and shared beach access.',
    images: [],
  },
  {
    name: 'Courtyard Villa',
    unitNumber: 'VL-03',
    project: 'O West',
    city: '6th of October',
    address: '6th of October, Egypt',
    area: 380,
    price: 18900000,
    beds: 5,
    baths: 5,
    description:
      'Standalone villa arranged around a planted courtyard, staff quarters and a two-car garage.',
    images: [],
  },
  {
    name: 'Hilltop Chalet',
    unitNumber: 'CH-88',
    project: 'Marassi',
    city: 'North Coast',
    address: 'North Coast, Egypt',
    area: 118,
    price: 3750000,
    beds: 2,
    baths: 2,
    description: 'Elevated chalet capturing the breeze, open-plan kitchen and a shaded pergola terrace.',
    images: [],
  },
  {
    name: 'Central Loft',
    unitNumber: 'LF-22',
    project: 'ZED East',
    city: 'New Cairo',
    address: 'New Cairo, Egypt',
    area: 96,
    price: 3980000,
    beds: 1,
    baths: 2,
    description: 'Industrial-style loft with exposed ceilings, walk-in wardrobe and floor-to-ceiling glazing.',
    images: [],
  },
  {
    name: 'Green Flat',
    unitNumber: 'GF-40',
    project: 'O West',
    city: '6th of October',
    address: '6th of October, Egypt',
    area: 156,
    price: 5600000,
    beds: 3,
    baths: 2,
    description: 'Ground-floor flat with a private planted garden, ample storage and a modern fitted kitchen.',
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
