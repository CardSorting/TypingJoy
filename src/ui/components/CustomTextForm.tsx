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
    <div className="warm-card p-6 max-w-xl mx-auto bg-white">
      <h2 className="text-xl font-bold text-amber-800 mb-6">
        {isEdit ? "Edit Custom Text" : "Create Custom Text"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="custom-text-title" className="block text-sm font-medium text-stone-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="custom-text-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="warm-input w-full"
            required
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "custom-text-title-error" : undefined}
          />
          {errors.title && (
            <p id="custom-text-title-error" className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Body */}
        <div>
          <label htmlFor="custom-text-body" className="block text-sm font-medium text-stone-700 mb-1">
            Body <span className="text-red-500">*</span>
          </label>
          <textarea
            id="custom-text-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="warm-input w-full font-mono"
            required
            aria-invalid={errors.body ? "true" : "false"}
            aria-describedby={errors.body ? "custom-text-body-error" : undefined}
          />
          {errors.body && (
            <p id="custom-text-body-error" className="text-red-500 text-sm mt-1">{errors.body}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="custom-text-tags" className="block text-sm font-medium text-stone-700 mb-1">
            Tags
          </label>
          <input
            id="custom-text-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="comma, separated"
            className="warm-input w-full"
          />
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
              : "Create Text"}
        </button>

        <div className="text-center pt-2">
          <Link
            href="/custom-texts"
            className="text-stone-400 hover:text-stone-600 text-sm underline font-semibold"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
