-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repoUrl" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "techStack" TEXT NOT NULL,
    "architecture" TEXT NOT NULL,
    "gettingStarted" TEXT NOT NULL,
    "readmeSuggestions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
