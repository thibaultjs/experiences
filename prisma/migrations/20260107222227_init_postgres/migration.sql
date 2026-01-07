-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "colorClass" TEXT NOT NULL,
    "activeColorClass" TEXT NOT NULL,
    "techStack" TEXT,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceDetail" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,

    CONSTRAINT "ExperienceDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExperienceDetail" ADD CONSTRAINT "ExperienceDetail_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
