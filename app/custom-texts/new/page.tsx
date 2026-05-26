/**
 * [LAYER: UI]
 */
'use client';

import { useRouter } from 'next/navigation';
import CustomTextForm from '@/src/ui/components/CustomTextForm';

export default function NewCustomTextPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Create Custom Text</h1>
      <CustomTextForm
        onSuccess={() => router.push('/custom-texts')}
      />
    </div>
  );
}