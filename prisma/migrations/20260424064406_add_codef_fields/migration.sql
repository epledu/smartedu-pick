-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "codefAccountNum" TEXT,
ADD COLUMN     "codefConnectedId" TEXT,
ADD COLUMN     "codefOrgCode" TEXT,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3);
