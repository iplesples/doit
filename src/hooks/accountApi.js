import api from "@/lib/api"

export const getAccounts = () =>
  api.get("/auth/accounts").then((res) => res.data)

export const postAccount = (data) =>
  api.post("/auth/accounts", data).then((res) => res.data)

export const patchAccount = (id, data) =>
  api.patch(`/auth/accounts/${id}`, data).then((res) => res.data)

export const deleteAccount = (id) => api.delete(`/auth/accounts/${id}`)