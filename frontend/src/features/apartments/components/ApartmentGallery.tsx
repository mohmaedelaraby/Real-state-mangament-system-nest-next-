'use client';

import { Image } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import styles from '../styles/apartmentGallery.module.css';
import { ApartmentGalleryProps } from '../interfaces';

export default function ApartmentGallery({ images, alt }: ApartmentGalleryProps) {
  if (images.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <HomeOutlined className={styles.emptyIcon} />
      </div>
    );
  }

  return (
    <Image.PreviewGroup>
      <div className={styles.galleryWrap}>
        <div className={styles.mainImageWrap}>
          <Image src={images[0]} alt={alt} width="100%" height={320} className={styles.mainImage} />
          {images.length > 1 && (
            <span className={styles.countBadge}>1 / {images.length}</span>
          )}
        </div>
        {images.length > 1 && (
          <div className={styles.thumbsWrap}>
            {images.slice(1).map((src, idx) => (
              <Image
                key={src}
                src={src}
                alt={`${alt} ${idx + 2}`}
                width={100}
                height={100}
                className={styles.thumb}
              />
            ))}
          </div>
        )}
      </div>
    </Image.PreviewGroup>
  );
}
