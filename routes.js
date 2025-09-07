import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { storage } from './storage.js'
import { insertProductSchema, insertCategorySchema, insertAdminUserSchema } from '../shared/schema.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Token necessário' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

// Public routes - Products
router.get('/api/products', async (_req, res) => {
  try {
    const products = await storage.getProducts()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
})

router.get('/api/products/:id', async (req, res) => {
  try {
    const product = await storage.getProductById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' })
  }
})

// Public routes - Categories
router.get('/api/categories', async (_req, res) => {
  try {
    const categories = await storage.getCategories()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias' })
  }
})

// Auth routes
router.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios' })
    }

    const admin = await storage.getAdminByUsername(username)
    if (!admin) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' })
    res.json({ token, user: { id: admin.id, username: admin.username } })
  } catch (error) {
    res.status(500).json({ error: 'Erro no login' })
  }
})

router.post('/api/auth/register', async (req, res) => {
  try {
    const validatedData = insertAdminUserSchema.parse(req.body)
    
    const existingAdmin = await storage.getAdminByUsername(validatedData.username)
    if (existingAdmin) {
      return res.status(400).json({ error: 'Username já existe' })
    }

    const admin = await storage.createAdmin(validatedData)
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' })
    
    res.status(201).json({ token, user: { id: admin.id, username: admin.username } })
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' })
  }
})

// Protected admin routes - Products
router.post('/api/admin/products', authMiddleware, async (req, res) => {
  try {
    const validatedData = insertProductSchema.parse(req.body)
    const product = await storage.createProduct(validatedData)
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' })
  }
})

router.put('/api/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await storage.updateProduct(req.params.id, req.body)
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    res.json(product)
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar produto' })
  }
})

router.delete('/api/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await storage.deleteProduct(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    res.json({ message: 'Produto removido' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto' })
  }
})

// Protected admin routes - Categories
router.post('/api/admin/categories', authMiddleware, async (req, res) => {
  try {
    const validatedData = insertCategorySchema.parse(req.body)
    const category = await storage.createCategory(validatedData)
    res.status(201).json(category)
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' })
  }
})

router.put('/api/admin/categories/:id', authMiddleware, async (req, res) => {
  try {
    const category = await storage.updateCategory(req.params.id, req.body)
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' })
    }
    res.json(category)
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar categoria' })
  }
})

router.delete('/api/admin/categories/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await storage.deleteCategory(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Categoria não encontrada' })
    }
    res.json({ message: 'Categoria removida' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover categoria' })
  }
})

export default router