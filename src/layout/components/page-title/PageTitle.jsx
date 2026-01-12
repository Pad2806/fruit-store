import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { routeTitles } from '../../../routes/route'

const DEFAULT_TITLE = 'Fruit Store'

export default function PageTitle() {
  const location = useLocation()

  useEffect(() => {
    const title = routeTitles[location.pathname]
    document.title = title ? `${title} | Fruit Store` : DEFAULT_TITLE
  }, [location.pathname])

  return null
}
