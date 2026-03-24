import { type FC } from 'react'
import { useRoutes } from 'react-router-dom'
import IdentifyPage from '../pages/IdentifyPage'
import IdentifyResultPage from '../pages/IdentifyResultPage'

const routesConfig = [
  {
    path: '/',
    element: <IdentifyPage />,
  },
  {
    path: '/result',
    element: <IdentifyResultPage />,
  },
]

const AppRoutes: FC = () => {
  const element = useRoutes(routesConfig)
  return element
}

export default AppRoutes
