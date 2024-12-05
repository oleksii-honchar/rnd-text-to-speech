-- CreateTable
CREATE TABLE "TextSource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceType" TEXT NOT NULL,
    "content" BLOB NOT NULL,
    "contentSize" INTEGER NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TextSourceLine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "index" INTEGER NOT NULL,
    "lineText" TEXT NOT NULL,
    "textSourceId" INTEGER NOT NULL,
    CONSTRAINT "TextSourceLine_textSourceId_fkey" FOREIGN KEY ("textSourceId") REFERENCES "TextSource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TextSourceLineSentence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "index" INTEGER NOT NULL,
    "sentenceText" TEXT NOT NULL,
    "textSourceLineId" INTEGER NOT NULL,
    CONSTRAINT "TextSourceLineSentence_textSourceLineId_fkey" FOREIGN KEY ("textSourceLineId") REFERENCES "TextSourceLine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
