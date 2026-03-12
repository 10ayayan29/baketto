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
      title: 'Baketto - やりたいことリスト',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '友達とシェアできる、シンプルなバケットリストアプリ' },
        // OGP
        { property: 'og:title', content: 'Baketto - やりたいことリスト' },
        { property: 'og:description', content: '友達とシェアできる、シンプルなバケットリストアプリ' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/og-image.png' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Baketto - やりたいことリスト' },
        { name: 'twitter:description', content: '友達とシェアできる、シンプルなバケットリストアプリ' },
        { name: 'twitter:image', content: '/og-image.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})
