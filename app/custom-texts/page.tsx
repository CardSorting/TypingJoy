/**
 * [LAYER: INFRASTRUCTURE]
 */
import Link from 'next/link';
import { getCustomTexts } from '@/src/core/actions/custom-texts';
import { CustomPracticeText } from '@/src/domain/types';
import AppLayout from '@/src/ui/components/AppLayout';

export const dynamic = 'force-dynamic';

export default async function CustomTextsPage() {
  const texts = await getCustomTexts();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-800">✍️ Custom Writing Studio</h1>
            <p className="text-xs text-stone-500 mt-1">
              Import paragraphs or select custom texts to hone your touch typing rhythm with personalized materials.
            </p>
          </div>
          <Link
            href="/custom-texts/new"
            className="warm-button text-xs py-2 px-4 self-start sm:self-auto"
          >
            + Create Text
          </Link>
        </div>

      {texts.length === 0 ? (
        <div className="warm-card p-12 text-center text-stone-500 max-w-md mx-auto">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">No custom texts imported</h2>
          <p className="text-xs text-stone-600 mb-6 leading-relaxed">
            Your personal writing library is empty. Import code snippets, essay quotes, or paragraphs to practice typing what matters to you.
          </p>
          <Link
            href="/custom-texts/new"
            className="warm-button text-xs py-2 px-5 inline-block"
          >
            Import First Text
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {texts.map((text: CustomPracticeText) => (
            <div
              key={text.id}
              className="warm-card p-5 flex flex-col justify-between hover:shadow-md hover:border-amber-300/60 transition-all duration-200"
            >
              <div>
                <h2 className="font-bold text-stone-850 text-sm mb-2">{text.title}</h2>
                <p className="text-[11px] text-stone-500 line-clamp-3 font-mono mb-4 bg-stone-50/50 p-2.5 rounded border border-stone-100">
                  {text.body}
                </p>
                {(() => {
                  const tagList = text.tags ? text.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
                  return tagList.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tagList.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/40 text-[9px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>
              <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-3">
                <Link
                  href={`/practice/${text.id}`}
                  className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow-xs transition"
                >
                  Start Practice
                </Link>
                <Link
                  href={`/custom-texts/${text.id}`}
                  className="text-xs text-amber-700 hover:underline font-semibold"
                >
                  Edit Text
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </AppLayout>
  );
}
