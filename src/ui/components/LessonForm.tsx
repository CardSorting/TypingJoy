/**
 * [LAYER: UI]
 * LessonForm — Create or edit typing lessons.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Lesson, Difficulty, Focus } from "@/src/domain/types";
import { createLesson, updateLesson } from "@/src/core/actions/lessons";

const FOCUS_OPTIONS = [
  "home-row",
  "top-row",
  "bottom-row",
  "numbers",
  "symbols",
  "mixed",
] as const;

const DIFFICULTY_OPTIONS = ["beginner", "intermediate", "advanced"] as const;

interface LessonFormProps {
  initialData?: {
    title: string;
    description: string;
    difficulty: string;
    focus: string;
    content: string;
    estimatedMinutes: number;
  };
  lessonId?: string;
  onSuccess?: (id: string) => void;
}

interface FormErrors {
  title?: string;
  content?: string;
  estimatedMinutes?: string;
}

export default function LessonForm({
  initialData,
  lessonId,
  onSuccess,
}: LessonFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData && lessonId);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? "beginner");
  const [focus, setFocus] = useState(initialData?.focus ?? "mixed");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    initialData?.estimatedMinutes ?? 5,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!content.trim()) errs.content = "Content is required";
    if (!estimatedMinutes || estimatedMinutes < 1)
      errs.estimatedMinutes = "Must be at least 1 minute";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEdit && lessonId) {
        const updated = await updateLesson(lessonId, {
          title: title.trim(),
          description: description.trim(),
          difficulty: difficulty as Lesson["difficulty"],
          focus: focus as Lesson["focus"],
          content: content.trim(),
          estimatedMinutes,
        });
        if (onSuccess) {
          onSuccess(updated.id);
        } else {
          router.push(`/lessons/${lessonId}`);
        }
      } else {
        const created = await createLesson({
          title: title.trim(),
          description: description.trim(),
          difficulty: difficulty as Lesson["difficulty"],
          focus: focus as Lesson["focus"],
          content: content.trim(),
          estimatedMinutes,
        });
        if (onSuccess) {
          onSuccess(created.id);
        } else {
          router.push(`/lessons/${created.id}`);
        }
      }
    } catch {
      setErrors({ title: "Failed to save lesson. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="warm-card p-6 max-w-xl mx-auto bg-white">
      <h2 className="text-xl font-bold text-amber-800 mb-6">
        {isEdit ? "Edit Lesson" : "Create Lesson"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="lesson-title" className="block text-sm font-medium text-stone-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="lesson-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="warm-input w-full"
            required
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "lesson-title-error" : undefined}
          />
          {errors.title && (
            <p id="lesson-title-error" className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="lesson-description" className="block text-sm font-medium text-stone-700 mb-1">
            Description
          </label>
          <textarea
            id="lesson-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="warm-input w-full"
          />
        </div>

        {/* Difficulty & Focus */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lesson-difficulty" className="block text-sm font-medium text-stone-700 mb-1">
              Difficulty
            </label>
            <select
              id="lesson-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="warm-input w-full"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="lesson-focus" className="block text-sm font-medium text-stone-700 mb-1">
              Focus
            </label>
            <select
              id="lesson-focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value as Focus)}
              className="warm-input w-full"
            >
              {FOCUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="lesson-content" className="block text-sm font-medium text-stone-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="lesson-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="warm-input w-full font-mono"
            required
            aria-invalid={errors.content ? "true" : "false"}
            aria-describedby={errors.content ? "lesson-content-error" : undefined}
          />
          {errors.content && (
            <p id="lesson-content-error" className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* Estimated Minutes */}
        <div>
          <label htmlFor="lesson-minutes" className="block text-sm font-medium text-stone-700 mb-1">
            Estimated Minutes <span className="text-red-500">*</span>
          </label>
          <input
            id="lesson-minutes"
            type="number"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            min={1}
            className="warm-input w-full"
            required
            aria-invalid={errors.estimatedMinutes ? "true" : "false"}
            aria-describedby={errors.estimatedMinutes ? "lesson-minutes-error" : undefined}
          />
          {errors.estimatedMinutes && (
            <p id="lesson-minutes-error" className="text-red-500 text-sm mt-1">
              {errors.estimatedMinutes}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="warm-button w-full mt-6"
        >
          {submitting
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Create Lesson"}
        </button>

        <div className="text-center pt-2">
          <Link
            href="/lessons"
            className="text-amber-700 hover:text-amber-800 text-sm underline font-semibold"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
