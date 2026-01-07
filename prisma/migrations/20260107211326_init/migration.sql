-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "colorClass" TEXT NOT NULL,
    "activeColorClass" TEXT NOT NULL,
    "techStack" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ExperienceDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    CONSTRAINT "ExperienceDetail_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
