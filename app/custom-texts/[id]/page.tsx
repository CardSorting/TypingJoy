/**
 * [LAYER: UI]
 * CustomTextDetailPage — Displays details for custom texts, with editing/deletion interfaces and start action.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCustomText } from '@/src/core/actions/custom-texts';
import EditCustomTextWrapper from '@/src/ui/components/EditCustomTextWrapper';
import DeleteCustomTextWrapper from '@/src/ui/components/DeleteCustomTextWrapper';
import AppLayout from '@/src/ui/components/AppLayout';

interface CustomTextDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomTextDetailPage({ params }: CustomTextDetailPageProps) {
  const { id } = await params;
  const text = await getCustomText(id);

  if (!text) {
    notFound();
  }

  const tagList = text.tags
    ? text.tags
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/custom-texts"
          className="text-amber-700 hover:text-amber-800 text-sm font-semibold underline"
        >
          ← Back to Custom Texts
        </Link>
      </div>

      {/* Main card */}
      <div className="warm-card p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h1 className="text-2xl font-bold text-stone-800">{text.title}</h1>
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tagList.map((tag: string) => (
                <span
                  key={tag}
                  className="inline px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-stone-400 mb-6">
          Created: {new Date(text.createdAt).toLocaleDateString()}
        </p>

        <pre className="bg-stone-800 text-stone-100 rounded-xl p-6 font-mono text-base leading-relaxed whitespace-pre-wrap border border-stone-700 shadow-inner select-none mb-6">
          {text.body}
        </pre>

        <div className="flex items-center gap-4">
          <Link
            href={`/practice/${text.id}`}
            className="warm-button text-center inline-block"
          >
            Practice This Text
          </Link>
        </div>
      </div>

      {/* Edit wrapper */}
      <div className="border-t border-amber-200/50 pt-8 mt-8">
        <EditCustomTextWrapper textId={id} initialData={text} />
      </div>

      {/* Delete danger zone */}
      <div className="border-t border-amber-200/50 pt-8 mt-12 bg-red-50/20 p-6 rounded-xl border border-red-200/30">
        <h2 className="text-lg font-bold text-red-700 mb-1">⚠️ Danger Zone</h2>
        <p className="text-xs text-stone-500 mb-4">
          Deleting a custom practice text is permanent. All completed typing sessions for this text will be removed.
        </p>
        <DeleteCustomTextWrapper textId={id} />
      </div>
      </div>
    </AppLayout>
  );
}
