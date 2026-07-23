'use client';

import { Button, Col, Form, Input, InputNumber, Row, Select, Upload } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useApartmentForm } from '../hooks/useApartmentForm';
import { AREA_OPTIONS, CITIES, PROJECTS } from '../constants';
import styles from '../styles/apartmentForm.module.css';
import { ApartmentFormProps, ApartmentFormValues } from '../interfaces';

const { TextArea } = Input;

export default function ApartmentForm({ onDone }: ApartmentFormProps) {
  const [form] = Form.useForm<ApartmentFormValues>();
  const {
    fileList,
    previewUrls,
    submitting,
    hasInvalidFile,
    uploadProps,
    removeFile,
    onFinish,
  } = useApartmentForm({ onDone });

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
