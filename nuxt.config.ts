export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxtjs/supabase'],

  supabase: {
    redirect: false,
  },

  css: ['~/assets/styles/main.scss'],

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  app: {
    head: {
      title: 'Bucket List',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '共同編集できるバケットリストアプリ' }
      ]
    }
  }
})
