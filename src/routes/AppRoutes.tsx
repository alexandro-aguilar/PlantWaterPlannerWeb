import { type FC } from 'react'
import { useRoutes } from 'react-router-dom'
import IdentifyPage from '../pages/IdentifyPage'

const routesConfig = [
  {
    path: '/',
    element: <IdentifyPage />,
  },
]

const AppRoutes: FC = () => {
  const element = useRoutes(routesConfig)
  return element
}

export { routesConfig }
export default AppRoutes
