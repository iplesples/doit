import { Navigate, Outlet, useLocation } from "react-router-dom"

function getSession() {
  try {
    const value = sessionStorage.getItem("auth")
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export default function ProtectedRoute({ roles }) {
  const location = useLocation()
  const session = getSession()

  // 1. Belum login atau token tidak tersedia
  if (!session?.token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // 2. Periksa role yang diizinkan untuk rute ini
  if (roles && !roles.includes(session.role)) {
    return (
      <Navigate
        to={session.dashboard_path || "/login"}
        replace
      />
    )
  }

  // 3. Pengguna non-master hanya boleh membuka dashboard miliknya
  if (
    session.role !== "master" &&
    session.dashboard_path &&
    location.pathname !== session.dashboard_path
  ) {
    return <Navigate to={session.dashboard_path} replace />
  }

  // 4. Login valid dan akses diizinkan
  return <Outlet />
}