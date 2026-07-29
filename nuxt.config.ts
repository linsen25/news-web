export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    apiBase:
      process.env.NUXT_PUBLIC_API_BASE_URL
      || process.env.NUXT_API_BASE
      || 'http://localhost:3001/api',
  },
  app: {
    head: {
      titleTemplate: '%s · The Current',
      title: 'The Current',
      meta: [{ name: 'description', content: '独立、清晰、有现场感的新闻阅读体验' }],
    },
  },
  typescript: { strict: true },
});
