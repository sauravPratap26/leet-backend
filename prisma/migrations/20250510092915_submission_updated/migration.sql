-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_problemId_fkey";

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "compileOutput" DROP NOT NULL,
ALTER COLUMN "memory" DROP NOT NULL,
ALTER COLUMN "time" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
