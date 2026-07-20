'use client';

import { useState } from 'react';
import { Button, Form, Input, InputNumber, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useRouter } from 'next/navigation';
import { createApartment } from '../api/apartmentsApi';

const { Dragger } = Upload;
const { TextArea } = Input;

interface FormValues {
  name: string;
  unitNumber: string;
  project: string;
  description: string;
  address: string;
  area: number;
}

export default function ApartmentForm() {
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
      router.push(`/apartments/${apartment.id}`);
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to create apartment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
      <Form.Item name="name" label="Unit name" rules={[{ required: true, message: 'Please enter a unit name' }]}>
        <Input placeholder="e.g. Maple Residence 3B" />
      </Form.Item>

      <Form.Item
        name="unitNumber"
        label="Unit number"
        rules={[{ required: true, message: 'Please enter a unit number' }]}
      >
        <Input placeholder="e.g. 3B" />
      </Form.Item>

      <Form.Item name="project" label="Project" rules={[{ required: true, message: 'Please enter a project name' }]}>
        <Input placeholder="e.g. Maple Heights" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: 'Please enter an address' }]}
      >
        <Input placeholder="e.g. 12 Maple Street, New Cairo" />
      </Form.Item>

      <Form.Item
        name="area"
        label="Area (sqm)"
        rules={[{ required: true, message: 'Please enter the area' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 120.5" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <TextArea rows={4} placeholder="Describe the apartment..." />
      </Form.Item>

      <Form.Item label="Images">
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
          Create apartment
        </Button>
      </Form.Item>
    </Form>
  );
}
