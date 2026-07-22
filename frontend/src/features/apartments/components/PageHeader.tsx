'use client';

import { useState } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ApartmentForm from './ApartmentForm';
import styles from '../styles/pageHeader.module.css';

export default function PageHeader() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoLink}>
          <div className={styles.logoBadge}>N</div>
          <div className={styles.logoText}>nawy</div>
        </div>
        <div className={styles.spacer} />
        <nav className={styles.nav}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsFormOpen(true)}>
            Add a unit
          </Button>
        </nav>
      </div>

      <Modal
        title="Add Apartment"
        open={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        footer={null}
        width={720}
        centered
        destroyOnHidden
      >
        <ApartmentForm onDone={() => setIsFormOpen(false)} />
      </Modal>
    </header>
  );
}
