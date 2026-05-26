-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TypingSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT,
    "customTextId" TEXT,
    "typedText" TEXT NOT NULL,
    "targetText" TEXT NOT NULL,
    "wpm" REAL NOT NULL,
    "accuracy" REAL NOT NULL,
    "mistakes" INTEGER NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TypingSession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TypingSession_customTextId_fkey" FOREIGN KEY ("customTextId") REFERENCES "CustomPracticeText" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TypingSession" ("accuracy", "completedAt", "durationSeconds", "id", "lessonId", "mistakes", "targetText", "typedText", "wpm") SELECT "accuracy", "completedAt", "durationSeconds", "id", "lessonId", "mistakes", "targetText", "typedText", "wpm" FROM "TypingSession";
DROP TABLE "TypingSession";
ALTER TABLE "new_TypingSession" RENAME TO "TypingSession";
CREATE INDEX "TypingSession_lessonId_idx" ON "TypingSession"("lessonId");
CREATE INDEX "TypingSession_customTextId_idx" ON "TypingSession"("customTextId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
