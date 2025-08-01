import { Navigate, Outlet } from 'react-router'

type ProtectedRouteProps = {
  isAllowed: boolean
  redirectPath?: string
  children?: React.ReactNode
}

export const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/',
  children
}: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />
}