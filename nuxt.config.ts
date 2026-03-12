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
      title: 'Buketto - シェアして一緒に叶えるバケットリスト',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'シェアして一緒に叶えるバケットリスト' },
        // OGP
        { property: 'og:title', content: 'Buketto - シェアして一緒に叶えるバケットリスト' },
        { property: 'og:description', content: 'シェアして一緒に叶えるバケットリスト' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/og-image.png' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Buketto - シェアして一緒に叶えるバケットリスト' },
        { name: 'twitter:description', content: 'シェアして一緒に叶えるバケットリスト' },
        { name: 'twitter:image', content: '/og-image.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})
