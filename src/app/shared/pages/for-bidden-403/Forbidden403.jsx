import { Button, Result, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './Forbidden403.module.scss'

const { Text } = Typography

export default function Forbidden403() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Result
          status='403'
          title='403 — Truy cập bị từ chối'
          subTitle='Bạn không có quyền truy cập trang này. Vui lòng đăng nhập đúng vai trò hoặc quay lại.'
        />

        <div className={styles.hint}>
          <Text type='secondary'>Nếu bạn nghĩ đây là lỗi hệ thống, hãy liên hệ quản trị viên để được cấp quyền.</Text>
        </div>

        <Space className={styles.actions} size='middle' wrap>
          <Button type='primary' className={styles.btnPrimary} onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
          <Button type='link' className={styles.btnLink} onClick={() => navigate('/login')}>
            Đăng nhập
          </Button>
        </Space>
      </div>
    </div>
  )
}
