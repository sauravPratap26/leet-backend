-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "languageSolutionArray" TEXT[] DEFAULT ARRAY[]::TEXT[];
