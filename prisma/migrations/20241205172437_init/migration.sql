-- CreateTable
CREATE TABLE "SpeechProvider" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SpeechProviderVoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,
    "voiceId" TEXT NOT NULL,
    CONSTRAINT "SpeechProviderVoice_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "SpeechProvider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SpeechProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,
    "voiceId" INTEGER NOT NULL,
    CONSTRAINT "SpeechProfile_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "SpeechProvider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SpeechProfile_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "SpeechProviderVoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
