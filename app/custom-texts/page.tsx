/**
 * [LAYER: INFRASTRUCTURE]
 */
import Link from 'next/link';
import { getCustomTexts } from '@/src/core/actions/custom-texts';
import { CustomPracticeText } from '@/src/domain/types';

export default async function CustomTextsPage() {
  const texts = await getCustomTexts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Custom Practice Texts</h1>
        <Link
          href="/custom-texts/new"
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2"
        >
          New Custom Text
        </Link>
      </div>

      {texts.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-lg mb-4">No custom texts yet. Create your first one!</p>
          <Link
            href="/custom-texts/new"
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2 inline-block"
          >
            Create Custom Text
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {texts.map((text: CustomPracticeText) => (
            <div
              key={text.id}
              className="bg-white rounded-xl shadow-sm p-5 border border-stone-100"
            >
              <Link href={`/custom-texts/${text.id}`} className="block mb-3">
                <h2 className="font-semibold text-stone-800 mb-2">{text.title}</h2>
                <p className="text-sm text-stone-500 line-clamp-3 font-mono mb-3">
                  {text.body}
                </p>
                {(() => {
                  const tagList = text.tags ? text.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
                  return tagList.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
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
              </Link>
              <Link
                href={`/custom-texts/${text.id}`}
                className="text-xs text-amber-600 hover:text-amber-700"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}