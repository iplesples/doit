import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"

import Login from "@/pages/Login"
import Master from "@/pages/Master"
import Qc from "@/pages/Qc"
import Monitor from "@/pages/Monitor"
import ProtectedRoute from "@/components/fragments/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute roles={["master"]} />}>
          <Route path="/dashboard/master" element={<Master />} />
        </Route>

        <Route element={<ProtectedRoute roles={["qc"]} />}>
          <Route path="/dashboard/qc/endline/:nomor" element={<Qc />} />
        </Route>

        <Route path="/monitor/line/:nomor" element={<Monitor />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}