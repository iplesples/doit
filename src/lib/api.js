import axios from "axios"

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")

if (!API_URL) throw new Error("VITE_API_URL belum dikonfigurasi di file .env")

const api = axios.create({ baseURL: API_URL })

// Sebelum setiap request dikirim, tambahkan token login kalau ada
api.interceptors.request.use((config) => {
  const auth = JSON.parse(sessionStorage.getItem("auth") || "null")
  if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

export default api
export { API_URL }