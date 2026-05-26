/** [LAYER: CORE] */
// TypingSession server actions — orchestrates domain logic with infrastructure.

"use server";

import { db } from "@/src/infrastructure/db";
import { revalidatePath } from "next/cache";
import { CreateSessionInput } from "@/src/domain/types";

export async function createSession(data: CreateSessionInput) {
  const session = await db.typingSession.create({
    data: {
      lessonId: data.lessonId || undefined,
      customTextId: data.customTextId || undefined,
      typedText: data.typedText,
      targetText: data.targetText,
      wpm: data.wpm,
      accuracy: data.accuracy,
      mistakes: data.mistakes,
      durationSeconds: data.durationSeconds,
    },
  });
  revalidatePath("/");
  if (data.lessonId) {
    revalidatePath(`/lessons/${data.lessonId}`);
  }
  if (data.customTextId) {
    revalidatePath(`/custom-texts/${data.customTextId}`);
  }
  revalidatePath("/progress");
  return session;
}

export async function getSessions(limit = 50, offset = 0) {
  return db.typingSession.findMany({
    orderBy: { completedAt: "desc" },
    take: limit,
    skip: offset,
    include: {
      lesson: { select: { id: true, title: true, difficulty: true } },
      customText: { select: { id: true, title: true } },
    },
  });
}

export async function getSession(id: string) {
  return db.typingSession.findUnique({
    where: { id },
    include: {
      lesson: { select: { id: true, title: true, difficulty: true } },
      customText: { select: { id: true, title: true } },
    },
  });
}

export async function getSessionsByLesson(lessonId: string) {
  return db.typingSession.findMany({
    where: { lessonId },
    orderBy: { completedAt: "desc" },
  });
}