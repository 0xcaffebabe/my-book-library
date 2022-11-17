import BookUtils from 'utils/BookUtils';
import { Button, PageHeader } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './ReaderHeader.module.css'
import { EyeOutlined } from '@ant-design/icons';

export default function ReaderHeader(props: {
    screenshot: () => void,
    clearScreenshot: () => void, file: string,
    enterEyeMode: () => void,
    openCategory: () => void
  }) {
  const navigate = useNavigate()
  return (
    <PageHeader
    className={styles.readerHeader}
    onBack={() => navigate("/")}
    title={BookUtils.url2name(props.file)}
    subTitle={props.file}
    extra={[
      <Button type="primary" onClick={props.screenshot}>截屏</Button>,
      <Button type="primary" onClick={props.clearScreenshot}>清除截屏</Button>,
      <Button type="primary" onClick={props.enterEyeMode}>
        <EyeOutlined />
        护眼模式
      </Button>,
      <Button onClick={props.openCategory}>目录</Button>
    ]}
    >
    </PageHeader>
  )
}
