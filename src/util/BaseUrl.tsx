export const getbaseurl = () => {
  if (import.meta.env.dev) {
    return '/api' // uses vite proxy in development
  }
  return import.meta.env.vite_api_backend_url // uses direct url in production
}
