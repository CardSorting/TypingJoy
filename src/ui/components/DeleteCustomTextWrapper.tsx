/** [LAYER: UI] */
'use client';

import { useRouter } from 'next/navigation';
import { deleteCustomText } from '@/src/core/actions/custom-texts';

export default function DeleteCustomTextWrapper({ textId }: { textId: string }) {
  const router = useRouter();

  async function handleDelete() {
    await deleteCustomText(textId);
    router.push('/custom-texts');
  }

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2"
      >
        Delete Custom Text
      </button>
    </form>
  );
}