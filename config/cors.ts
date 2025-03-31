import { defineConfig } from '@adonisjs/cors'

export default defineConfig({
  enabled: true,
  origin: ['http://localhost:3333', 'http://127.0.0.1:3333', 'exp://127.0.0.1:*'],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: [
    'cache-control',
    'content-language',
    'content-type',
    'expires',
    'last-modified',
    'pragma',
  ],
  credentials: true,
  maxAge: 90,
})
