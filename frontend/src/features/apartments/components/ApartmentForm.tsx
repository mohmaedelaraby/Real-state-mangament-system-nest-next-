'use client';

import { useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useRouter } from 'next/navigation';
import { createApartment } from '../api/apartmentsApi';
import { AREA_OPTIONS, CITIES, PROJECTS } from '../constants';
import styles from '../styles/apartmentForm.module.css';

const { Dragger } = Upload;
const { TextArea } = Input;

interface FormValues {
  name: string;
  unitNumber: string;
  project: string;
  city: string;
  description: string;
  address: string;
  area: number;
  price: number;
  beds: number;
  baths: number;
}

interface Props {
  onDone?: () => void;
}

export default function ApartmentForm({ onDone }: Props) {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const uploadProps: UploadProps = {
    multiple: true,
    listType: 'picture-card',
    fileList,
    beforeUpload: () => false,
    onChange: ({ fileList: newList }) => setFileList(newList),
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const onFinish = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const images = fileList
        .map((f) => f.originFileObj)
        .filter((f): f is NonNullable<typeof f> => Boolean(f)) as File[];

      const apartment = await createApartment({ ...values, images });
      message.success('Apartment created successfully');
      onDone?.();
      router.push(`/apartments/${apartment.id}`);
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to create apartment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="name"
            label="Unit name"
            rules={[{ required: true, message: 'Please enter a unit name' }]}
          >
            <Input placeholder="e.g. Sea-view Chalet" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="unitNumber"
            label="Unit number"
            rules={[{ required: true, message: 'Please enter a unit number' }]}
          >
            <Input placeholder="e.g. CH-204" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="project"
            label="Project"
            rules={[{ required: true, message: 'Please select a project' }]}
          >
            <Select
              placeholder="Select a project"
              options={PROJECTS.map((p) => ({ value: p, label: p }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please select a city' }]}>
            <Select placeholder="Select a city" options={CITIES.map((c) => ({ value: c, label: c }))} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Form.Item name="area" label="Area (sqm)" rules={[{ required: true, message: 'Select area' }]}>
            <Select
              placeholder="Area"
              options={AREA_OPTIONS.map((a) => ({ value: a, label: `${a} sqm` }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6}>
          <Form.Item name="beds" label="Beds" rules={[{ required: true, message: 'Enter beds' }]}>
            <InputNumber min={0} className={styles.fullWidth} placeholder="2" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6}>
          <Form.Item name="baths" label="Baths" rules={[{ required: true, message: 'Enter baths' }]}>
            <InputNumber min={0} className={styles.fullWidth} placeholder="2" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6}>
          <Form.Item name="price" label="Price (EGP)" rules={[{ required: true, message: 'Enter price' }]}>
            <InputNumber min={0} className={styles.fullWidth} placeholder="3000000" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: 'Please enter an address' }]}
      >
        <Input placeholder="e.g. North Coast, Egypt" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <TextArea rows={4} placeholder="Describe the unit..." />
      </Form.Item>

      <Form.Item label="Photos">
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag images here to upload</p>
          <p className="ant-upload-hint">Supports multiple images. Uploaded on submit.</p>
        </Dragger>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting} block size="large">
          Publish listing
        </Button>
      </Form.Item>
    </Form>
  );
}
