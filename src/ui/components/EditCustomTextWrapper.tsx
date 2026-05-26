/** [LAYER: UI] */
'use client';

import CustomTextForm from '@/src/ui/components/CustomTextForm';
import { CustomPracticeText } from '@/src/domain/types';

export default function EditCustomTextWrapper({
  textId,
  initialData,
}: {
  textId: string;
  initialData: CustomPracticeText;
}) {
  return (
    <CustomTextForm
      textId={textId}
      initialData={initialData}
      onSuccess={() => {
        window.location.reload();
      }}
    />
  );
}