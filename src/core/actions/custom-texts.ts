/** [LAYER: CORE] */
// CustomPracticeText server actions — orchestrates domain logic with infrastructure.

"use server";

import { db } from "@/src/infrastructure/db";
import { revalidatePath } from "next/cache";
import { CreateCustomTextInput, UpdateCustomTextInput } from "@/src/domain/types";

export async function getCustomTexts() {
  return db.customPracticeText.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCustomText(id: string) {
  return db.customPracticeText.findUnique({ where: { id } });
}

export async function createCustomText(data: CreateCustomTextInput) {
  const text = await db.customPracticeText.create({
    data: {
      title: data.title,
      body: data.body,
      tags: data.tags,
    },
  });
  revalidatePath("/custom-texts");
  return text;
}

export async function updateCustomText(id: string, data: UpdateCustomTextInput) {
  const text = await db.customPracticeText.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.body !== undefined && { body: data.body }),
      ...(data.tags !== undefined && { tags: data.tags }),
    },
  });
  revalidatePath("/custom-texts");
  revalidatePath(`/custom-texts/${id}`);
  return text;
}

export async function deleteCustomText(id: string) {
  await db.customPracticeText.delete({ where: { id } });
  revalidatePath("/custom-texts");
}