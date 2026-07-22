import { UnsupportedMediaTypeException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB per file
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

/**
 * valdates and intercepts image uploads for a given field name. Supports multiple files.
 */
export function ImageUploadInterceptor(fieldName: string, maxCount = 10) {
  return FilesInterceptor(fieldName, maxCount, {
    storage: memoryStorage(),
    limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
    fileFilter: (_req, file, callback) => {
      if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
        callback(
          new UnsupportedMediaTypeException('Only JPEG, PNG, WEBP, or AVIF images are allowed'),
          false,
        );
        return;
      }
      callback(null, true);
    },
  });
}
