import { useEffect, useMemo, useState } from 'react';
import { message, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { useRouter } from 'next/navigation';
import { createApartment } from '../api/apartmentsApi';
import { ApartmentFormProps, ApartmentFormValues } from '../interfaces';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
export const ALLOWED_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/avif';

export function useApartmentForm({ onDone }: ApartmentFormProps) {
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hasInvalidFile, setHasInvalidFile] = useState(false);

  const uploadProps: UploadProps = {
    multiple: true,
    accept: ALLOWED_IMAGE_ACCEPT,
    fileList,
    showUploadList: false,
    beforeUpload: (file) => {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        message.warning(`${file.name} isn't a supported image type (JPEG, PNG, WEBP, or AVIF only)`);
        setHasInvalidFile(true);
        return Upload.LIST_IGNORE;
      }
      setHasInvalidFile(false);
      return false;
    },
    onChange: ({ fileList: newList }) => setFileList(newList),
  };

  const removeFile = (uid: string) => {
    setFileList((prev) => prev.filter((f) => f.uid !== uid));
  };

  const previewUrls = useMemo(() => {
    const urls = new Map<string, string>();
    fileList.forEach((file) => {
      if (file.originFileObj) {
        urls.set(file.uid, URL.createObjectURL(file.originFileObj));
      } else if (file.url) {
        urls.set(file.uid, file.url);
      }
    });
    return urls;
  }, [fileList]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const onFinish = async (values: ApartmentFormValues) => {
    setSubmitting(true);
    try {
      const images = fileList
        .map((f) => f.originFileObj)
        .filter((f): f is NonNullable<typeof f> => Boolean(f)) as File[];

      const result = await createApartment({ ...values, images });
      message.success(result.message);
      onDone?.();
      router.push(`/apartments/${result.data.id}`);
    } catch (err) {
      // Stay in the form on failure — the user needs the chance to fix the
      // problem (e.g. remove a rejected file) and resubmit, not lose
      // everything they filled in by being navigated away.
      message.error(err instanceof Error ? err.message : 'Failed to create apartment');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    fileList,
    previewUrls,
    submitting,
    hasInvalidFile,
    uploadProps,
    removeFile,
    onFinish,
  };
}
