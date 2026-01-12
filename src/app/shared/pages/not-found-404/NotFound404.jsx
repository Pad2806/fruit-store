import { Button, Result, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './NotFound404.module.scss'

const { Text } = Typography

export default function NotFound404() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Result
          status='404'
          title='404 — Không tìm thấy trang'
          subTitle='Trang bạn tìm không tồn tại hoặc đã được chuyển đi. Bạn có thể quay về trang chủ hoặc tìm chuyến xe.'
        />

        <div className={styles.hint}>
          <Text type='secondary'>
            Gợi ý: kiểm tra lại đường dẫn, hoặc quay về các trang công khai như Lịch trình / Tra cứu vé.
          </Text>
        </div>

        <Space className={styles.actions} size='middle' wrap>
          <Button type='primary' className={styles.btnPrimary} onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        </Space>
      </div>
    </div>
  )
}
