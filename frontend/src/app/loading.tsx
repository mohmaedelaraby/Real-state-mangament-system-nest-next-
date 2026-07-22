import { Spin, Row } from 'antd';

export default function GlobalLoading() {
  return (
    <Row justify="center" align="middle">
      <Spin size="large" />
    </Row>
  );
}
