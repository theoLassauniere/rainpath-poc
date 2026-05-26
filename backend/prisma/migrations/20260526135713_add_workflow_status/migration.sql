-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workflow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "nodes" TEXT NOT NULL DEFAULT '[]',
    "edges" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Workflow" ("createdAt", "description", "edges", "id", "name", "nodes", "updatedAt") SELECT "createdAt", "description", "edges", "id", "name", "nodes", "updatedAt" FROM "Workflow";
DROP TABLE "Workflow";
ALTER TABLE "new_Workflow" RENAME TO "Workflow";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
