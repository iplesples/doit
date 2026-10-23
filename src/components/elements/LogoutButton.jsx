
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"

export default function LogoutButton() {
  const { logout } = useAuth()

  return (
    <Button variant="outline" onClick={logout}>
      <LogOut />
      Logout
    </Button>
  )
}
