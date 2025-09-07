export class MemStorage {
  constructor() {
    this.products = []
    this.categories = [
      { id: crypto.randomUUID(), name: 'Camisetas', description: 'Camisetas masculinas' },
      { id: crypto.randomUUID(), name: 'Calças', description: 'Calças masculinas' },
      { id: crypto.randomUUID(), name: 'Jaquetas', description: 'Jaquetas e casacos' },
      { id: crypto.randomUUID(), name: 'Acessórios', description: 'Acessórios masculinos' }
    ]
    this.adminUsers = []
  }

  // Products
  async getProducts() {
    return this.products
  }

  async getProductById(id) {
    return this.products.find(p => p.id === id) || null
  }

  async createProduct(product) {
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }
    this.products.push(newProduct)
    return newProduct
  }

  async updateProduct(id, product) {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) return null
    
    this.products[index] = { ...this.products[index], ...product }
    return this.products[index]
  }

  async deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) return false
    
    this.products.splice(index, 1)
    return true
  }

  // Categories
  async getCategories() {
    return this.categories
  }

  async getCategoryById(id) {
    return this.categories.find(c => c.id === id) || null
  }

  async createCategory(category) {
    const newCategory = {
      ...category,
      id: crypto.randomUUID()
    }
    this.categories.push(newCategory)
    return newCategory
  }

  async updateCategory(id, category) {
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) return null
    
    this.categories[index] = { ...this.categories[index], ...category }
    return this.categories[index]
  }

  async deleteCategory(id) {
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) return false
    
    this.categories.splice(index, 1)
    return true
  }

  // Admin Users
  async getAdminByUsername(username) {
    return this.adminUsers.find(u => u.username === username) || null
  }

  async createAdmin(admin) {
    const bcrypt = require('bcryptjs')
    const passwordHash = await bcrypt.hash(admin.password, 10)
    
    const newAdmin = {
      id: crypto.randomUUID(),
      username: admin.username,
      passwordHash,
      createdAt: new Date()
    }
    this.adminUsers.push(newAdmin)
    return newAdmin
  }
}

export const storage = new MemStorage()