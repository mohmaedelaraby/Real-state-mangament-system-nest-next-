/*
  Warnings:

  - Added the required column `baths` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beds` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Apartment` table without a default value. This is not possible if the table is not empty.

*/
-- Clear existing seed/test data so the new NOT NULL columns can be added without a placeholder default
DELETE FROM "Apartment";

-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "baths" INTEGER NOT NULL,
ADD COLUMN     "beds" INTEGER NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
