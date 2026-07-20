'use client';

import { Image } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

interface Props {
  images: string[];
  alt: string;
}

export default function ApartmentGallery({ images, alt }: Props) {
  if (images.length === 0) {
    return (
      <div
        style={{
          height: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
          borderRadius: 8,
        }}
      >
        <HomeOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />
      </div>
    );
  }

  return (
    <Image.PreviewGroup>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Image
          src={images[0]}
          alt={alt}
          width="100%"
          height={320}
          style={{ objectFit: 'cover', borderRadius: 8, maxWidth: '100%' }}
        />
        {images.length > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {images.slice(1).map((src, idx) => (
              <Image
                key={src}
                src={src}
                alt={`${alt} ${idx + 2}`}
                width={100}
                height={100}
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
            ))}
          </div>
        )}
      </div>
    </Image.PreviewGroup>
  );
}
