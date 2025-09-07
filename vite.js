import express from 'express'
import cors from 'cors'
import { createServer as createViteServer } from 'vite'
import routes from './routes.js'

async function createServer() {
  const app = express()
  
  // Middleware
  app.use(cors())
  app.use(express.json())
  
  // API routes
  app.use(routes)

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  })

  // Use vite's connect instance as middleware
  app.use(vite.middlewares)

  const PORT = process.env.PORT || 5000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Loja de Roupas Masculina rodando!`)
    console.log(`📍 Porta interna: ${PORT}`)
    console.log(`🌐 Acesse sua loja no navegador`)
    console.log(`✅ Servidor pronto para receber requisições`)
  })
}

createServer().catch(console.error)