'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, Upload, message } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useRouter } from 'next/navigation';
import { createApartment } from '../api/apartmentsApi';
import { AREA_OPTIONS, CITIES, PROJECTS } from '../constants';
import styles from '../styles/apartmentForm.module.css';
import { ApartmentFormProps, ApartmentFormValues } from '../interfaces';

const { TextArea } = Input;

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const ALLOWED_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/avif';

export default function ApartmentForm({ onDone }: ApartmentFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<ApartmentFormValues>();
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
        <Upload {...uploadProps}>
          {fileList.length === 0 ? (
            <div className={styles.uploadTrigger}>
              <PlusOutlined />
              <div>Upload</div>
            </div>
          ) : (
            <div className={styles.uploadedFile}>
              {fileList.map((file) => (
                <div key={file.uid} className={styles.previewItem} onClick={(e) => e.stopPropagation()}>
                  <img src={previewUrls.get(file.uid)} alt="Preview" className={styles.previewImage} />
                  <button
                    type="button"
                    className={styles.previewRemove}
                    onClick={() => removeFile(file.uid)}
                  >
                    <CloseOutlined />
                  </button>
                </div>
              ))}
              <div className={styles.uploadTrigger}>
                <PlusOutlined />
                <div>Add more</div>
              </div>
            </div>
          )}
        </Upload>
      </Form.Item>



      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          disabled={hasInvalidFile}
          block
          size="large"
        >
          Add Unit
        </Button>
      </Form.Item>
    </Form>
  );
}
