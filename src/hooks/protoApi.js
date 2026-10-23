import api from "@/lib/api"

// ---------- Scan ----------

export const postRelease = (data) =>
  api.post("/proto/release", data).then((res) => res.data)

export const postRepair = (data) =>
  api.post("/proto/repair", data).then((res) => res.data)

// ---------- Data awal halaman QC ----------

export const getSummary = (lineId) =>
  api.get(`/proto/summary/${lineId}`).then((res) => res.data)

// ---------- Pilihan operator / process / defect per line ----------

export const getOptions = (lineId) =>
  api.get(`/proto/options/${lineId}`).then((res) => res.data)

export const postOption = (data) =>
  api.post("/proto/options", data).then((res) => res.data)

export const patchOption = (id, data) =>
  api.patch(`/proto/options/${id}`, data).then((res) => res.data)

export const deleteOption = (id) => api.delete(`/proto/options/${id}`)