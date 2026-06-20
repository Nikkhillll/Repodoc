-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "techStack" TEXT NOT NULL,
    "architecture" TEXT NOT NULL,
    "gettingStarted" TEXT NOT NULL,
    "readmeSuggestions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);
