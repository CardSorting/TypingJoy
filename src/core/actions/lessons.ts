/** [LAYER: CORE] */
// Lesson CRUD server actions — orchestrates domain logic with infrastructure.

"use server";

import { db } from "@/src/infrastructure/db";
import { revalidatePath } from "next/cache";
import { CreateLessonInput } from "@/src/domain/types";
import type { Prisma } from "@prisma/client";

export async function getLessons() {
  return db.lesson.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { sessions: true } } },
  });
}

export async function getLesson(id: string) {
  return db.lesson.findUnique({
    where: { id },
    include: { _count: { select: { sessions: true } } },
  });
}

export async function createLesson(data: CreateLessonInput) {
  const lesson = await db.lesson.create({
    data: {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      focus: data.focus,
      content: data.content,
      estimatedMinutes: data.estimatedMinutes,
    },
  });
  revalidatePath("/");
  revalidatePath("/lessons");
  return lesson;
}

export async function updateLesson(id: string, data: Partial<CreateLessonInput>) {
  const lesson = await db.lesson.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
      ...(data.focus !== undefined && { focus: data.focus }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.estimatedMinutes !== undefined && { estimatedMinutes: data.estimatedMinutes }),
    },
  });
  revalidatePath("/");
  revalidatePath("/lessons");
  revalidatePath(`/lessons/${id}`);
  return lesson;
}

export async function deleteLesson(id: string) {
  await db.lesson.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/lessons");
}

export async function getLessonsByDifficulty(difficulty: string) {
  return db.lesson.findMany({
    where: { difficulty },
    orderBy: { createdAt: "desc" },
  });
}

export type LessonWithCount = Prisma.LessonGetPayload<{
  include: { _count: { select: { sessions: true } } }
}>;