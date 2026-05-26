/** [LAYER: UI] */
'use client';

import CustomTextForm from '@/src/ui/components/CustomTextForm';

export default function EditCustomTextWrapper({
  textId,
  initialData,
}: {
  textId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any;
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