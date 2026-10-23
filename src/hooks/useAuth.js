
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

export default function useAuth() {
  const navigate = useNavigate()

  const logout = useCallback(() => {
    sessionStorage.removeItem("auth")

    navigate("/login", { replace: true })
  }, [navigate])

  return { logout }
}
