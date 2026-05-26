/**
 * [LAYER: UI]
 * CustomTextForm — Create or edit custom practice texts.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CustomPracticeText } from "@/src/domain/types";
import {
  createCustomText,
  updateCustomText,
} from "@/src/core/actions/custom-texts";

interface CustomTextFormProps {
  initialData?: CustomPracticeText;
  textId?: string;
  onSuccess?: () => void;
}

interface FormErrors {
  title?: string;
  body?: string;
}

export default function CustomTextForm({
  initialData,
  textId,
  onSuccess,
}: CustomTextFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData && textId);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [tags, setTags] = useState(initialData?.tags ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!body.trim()) errs.body = "Body text is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEdit && textId) {
        await updateCustomText(textId, {
          title: title.trim(),
          body: body.trim(),
          tags: tags.trim(),
        });
      } else {
        await createCustomText({
          title: title.trim(),
          body: body.trim(),
          tags: tags.trim(),
        });
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/custom-texts");
      }
    } catch {
      setErrors({ title: "Failed to save. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl bg-white shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-stone-800 mb-6">
        {isEdit ? "Edit Custom Text" : "Create Custom Text"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Body <span className="text-red-500">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
          {errors.body && (
            <p className="text-red-500 text-sm mt-1">{errors.body}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="comma, separated"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          {submitting
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Create Text"}
        </button>

        <div className="text-center">
          <Link
            href="/custom-texts"
            className="text-stone-400 hover:text-stone-600 text-sm underline"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
