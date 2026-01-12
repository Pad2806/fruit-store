import { useEffect, useState } from 'react'
import styles from './ScrollToTopButton.module.scss'
import { ArrowUpOutlined } from '@ant-design/icons'

const ScrollButton = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setVisible(true)
      else setVisible(false)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      className={`${styles.scrollButton} ${visible ? styles.show : ''}`}
      onClick={scrollToTop}
      aria-label='Scroll to top'
    >
      <ArrowUpOutlined />
    </button>
  )
}

export default ScrollButton
