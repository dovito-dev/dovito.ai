import { users, type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private currentUserId: number;
  private currentProductId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    
    // Initialize with Dovito's current products
    this.initializeProducts();
  }

  private initializeProducts() {
    const initialProducts: Omit<Product, 'id'>[] = [
      {
        name: "Prompt Engineer",
        abbreviation: "Pe",
        description: "AI prompt optimization platform for enhanced productivity and consistent results",
        url: "https://pe.dovito.com",
        category: "AI Tools",
        status: "live",
        positionX: 1,
        positionY: 1,
        launchDate: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Septic Management",
        abbreviation: "SM",
        description: "Waste tracking automation system for septic and environmental services",
        url: "https://sm.dovito.com",
        category: "Environmental",
        status: "live",
        positionX: 2,
        positionY: 1,
        launchDate: new Date('2024-02-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Process Automation",
        abbreviation: "PA",
        description: "Comprehensive business process automation suite",
        url: null,
        category: "Automation",
        status: "coming_soon",
        positionX: 3,
        positionY: 1,
        launchDate: new Date('2024-06-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Lead Optimizer",
        abbreviation: "LO",
        description: "Lead-to-close conversion optimization platform",
        url: null,
        category: "Sales",
        status: "coming_soon",
        positionX: 1,
        positionY: 2,
        launchDate: new Date('2024-07-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    initialProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      status: insertProduct.status || "coming_soon",
      url: insertProduct.url || null,
      launchDate: insertProduct.launchDate || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...updateData,
      updatedAt: new Date()
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
}

export const storage = new MemStorage();
