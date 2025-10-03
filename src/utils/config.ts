export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
}


