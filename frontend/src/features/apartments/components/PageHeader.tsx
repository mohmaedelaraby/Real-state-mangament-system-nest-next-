'use client';

import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ApartmentForm from './ApartmentForm';
import { usePageHeader } from '../hooks/usePageHeader';
import styles from '../styles/pageHeader.module.css';

export default function PageHeader() {
  const { isFormOpen, openForm, closeForm } = usePageHeader();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoLink}>
          <div className={styles.logoBadge}>N</div>
          <div className={styles.logoText}>Nawy</div>
        </div>
        <div className={styles.spacer} />
        <nav className={styles.nav}>
          <Button type="primary" icon={<PlusOutlined />} onClick={openForm}>
            Add a unit
          </Button>
        </nav>
      </div>

      <Modal
        title="Add Apartment"
        open={isFormOpen}
        onCancel={closeForm}
        footer={null}
        width={720}
        centered
        destroyOnHidden
      >
        <ApartmentForm onDone={closeForm} />
      </Modal>
    </header>
  );
}
