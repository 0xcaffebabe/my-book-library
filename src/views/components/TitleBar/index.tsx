import { Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import styles from './TitleBar.module.css'

export default function TitleBar() {
  return <div className={styles.titleBar}>
    图书馆
    <div className={styles.optBtn}>
      <Button size='small'>
        <CloseOutlined />
      </Button>
    </div>
  </div>
}
