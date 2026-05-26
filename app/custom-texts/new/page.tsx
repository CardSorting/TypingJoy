"use client";

import { useRouter } from 'next/navigation';
import CustomTextForm from '@/src/ui/components/CustomTextForm';
import AppLayout from '@/src/ui/components/AppLayout';

export default function NewCustomTextPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-stone-850 mb-6">Create Custom Practice Text</h1>
        <CustomTextForm
          onSuccess={() => router.push('/custom-texts')}
        />
      </div>
    </AppLayout>
  );
}