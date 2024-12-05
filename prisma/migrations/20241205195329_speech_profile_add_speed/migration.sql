/*
  Warnings:

  - Added the required column `speed` to the `SpeechProfile` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SpeechProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "speed" REAL NOT NULL,
    "providerId" INTEGER NOT NULL,
    "voiceId" INTEGER NOT NULL,
    CONSTRAINT "SpeechProfile_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "SpeechProvider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SpeechProfile_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "SpeechProviderVoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SpeechProfile" ("id", "name", "providerId", "voiceId") SELECT "id", "name", "providerId", "voiceId" FROM "SpeechProfile";
DROP TABLE "SpeechProfile";
ALTER TABLE "new_SpeechProfile" RENAME TO "SpeechProfile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
