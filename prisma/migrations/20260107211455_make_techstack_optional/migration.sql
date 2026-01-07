-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Experience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "colorClass" TEXT NOT NULL,
    "activeColorClass" TEXT NOT NULL,
    "techStack" TEXT
);
INSERT INTO "new_Experience" ("activeColorClass", "colorClass", "id", "label", "location", "period", "role", "techStack") SELECT "activeColorClass", "colorClass", "id", "label", "location", "period", "role", "techStack" FROM "Experience";
DROP TABLE "Experience";
ALTER TABLE "new_Experience" RENAME TO "Experience";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
