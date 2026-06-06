import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://alimplas.injiniring-kompaniya.uz/api/v1'

// Public host — token kerak emas
export const $host = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Private host — JWT token bilan
export const $authHost = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

$authHost.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Backward-compatible alias for legacy src/api/*.ts files
export const api = $authHost