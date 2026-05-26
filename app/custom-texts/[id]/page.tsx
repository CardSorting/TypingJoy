/**
 * [LAYER: UI]
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCustomText } from '@/src/core/actions/custom-texts';
import EditCustomTextWrapper from '@/src/ui/components/EditCustomTextWrapper';
import DeleteCustomTextWrapper from '@/src/ui/components/DeleteCustomTextWrapper';

export default async function CustomTextDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const text = await getCustomText(id);

  if (!text) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800 mb-3">{text.title}</h1>
        {(() => {
          const tagList = text.tags ? text.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
          return tagList.length > 0 ? (
            <div className="flex flex-wrap gap-1 mb-4">
              {tagList.map((tag: string) => (
                <span
                  key={tag}
                  className="inline px-2 py-0.5 rounded-full text-xs bg-stone-100 text-stone-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null;
        })()}
      </div>

      <pre className="bg-stone-50 rounded-xl p-6 font-mono text-base leading-relaxed whitespace-pre-wrap border border-stone-200 mb-6 text-stone-800">
        {text.body}
      </pre>

      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/practice/${text.id}`}
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 py-3 font-semibold transition"
        >
          Start Practicing
        </Link>
      </div>

      <div className="border-t border-stone-200 pt-8 mt-8">
        <h2 className="text-xl font-semibold text-stone-800 mb-4">Edit</h2>
        <EditCustomTextWrapper textId={id} initialData={text} />
      </div>

      <div className="border-t border-stone-200 pt-8 mt-8">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Delete</h2>
        <DeleteCustomTextWrapper textId={id} />
      </div>
    </div>
  );
}