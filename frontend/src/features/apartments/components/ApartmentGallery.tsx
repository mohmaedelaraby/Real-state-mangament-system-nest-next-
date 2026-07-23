'use client';

import { Image, Tooltip } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import styles from '../styles/apartmentGallery.module.css';
import { ApartmentGalleryProps } from '../interfaces';
import { useApartmentGallery } from '../hooks/useApartmentGallery';

export default function ApartmentGallery({ images, alt }: ApartmentGalleryProps) {
  const { activeIndex, mainImage, selectImage } = useApartmentGallery(images);

  if (images.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <HomeOutlined className={styles.emptyIcon} />
      </div>
    );
  }

  return (
    <div className={styles.galleryWrap}>
      <div className={styles.mainImageWrap}>
        <Tooltip title="Click to show full image">
          <Image src={mainImage} alt={alt} width="100%" height={320} className={styles.mainImage} />
        </Tooltip>
        {images.length > 1 && (
          <span className={styles.countBadge}>
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className={styles.thumbsWrap}>
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => selectImage(idx)}
              className={`${styles.thumbButton} ${idx === activeIndex ? styles.thumbButtonActive : ''}`}
            >
              <img src={src} alt={`${alt} ${idx + 1}`} className={styles.thumb} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
