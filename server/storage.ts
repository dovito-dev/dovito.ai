import {
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type ContentSection,
  type InsertContentSection,
} from "@shared/schema";
import bcrypt from "bcryptjs";

// Current products from the database
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Prompt Engineer",
    abbreviation: "PE",
    description: "AI prompt optimization and engineering",
    category: "AI Tools",
    status: "live",
    url: "",
    positionX: 1,
    positionY: 1,
    launchDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Septic Management",
    abbreviation: "SM",
    description: "Smart septic system management",
    category: "Property",
    status: "live",
    url: "",
    positionX: 2,
    positionY: 1,
    launchDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Process Automation",
    abbreviation: "PA",
    description: "Business process automation tools",
    category: "Business",
    status: "live",
    url: "",
    positionX: 3,
    positionY: 1,
    launchDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: "Load Organizer",
    abbreviation: "LO",
    description: "Logistics and load management",
    category: "Logistics",
    status: "live",
    url: "",
    positionX: 4,
    positionY: 1,
    launchDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockUsers: User[] = [
  {
    id: 1,
    username: "info@dovito.com",
    password: "$2b$10$.H.oTeb8cZEGd/1JRGpJxOj9AYjc9Mg4WFhTHnba5w1SPvwUEqLEO",
    email: "info@dovito.com",
    role: "admin",
    firstName: null,
    lastName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  changeUserPassword(userId: number, newPassword: string): Promise<void>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Content management
  getContentSections(): Promise<ContentSection[]>;
  getContentSection(sectionKey: string): Promise<ContentSection | undefined>;
  createContentSection(section: InsertContentSection): Promise<ContentSection>;
  updateContentSection(id: number, section: Partial<InsertContentSection>): Promise<ContentSection | undefined>;
  deleteContentSection(id: number): Promise<boolean>;
}

export class MemoryStorage implements IStorage {
  private nextUserId = 2;
  private nextProductId = 5;
  private nextContentId = 1;

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return mockUsers.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return mockUsers.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = {
      id: this.nextUserId++,
      username: insertUser.username,
      password: hashedPassword,
      email: insertUser.email || null,
      role: insertUser.role,
      firstName: null,
      lastName: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(user);
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    console.log("Authenticating user:", username);
    const user = await this.getUserByUsername(username);
    console.log("Found user:", user ? user.username : "not found");
    if (!user) return null;
    
    console.log("Stored hash:", user.password);
    console.log("Provided password:", password);
    const isValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isValid);
    return isValid ? user : null;
  }

  async getAllUsers(): Promise<User[]> {
    return [...mockUsers];
  }

  async changeUserPassword(userId: number, newPassword: string): Promise<void> {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.password = await bcrypt.hash(newPassword, 10);
      user.updatedAt = new Date();
    }
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    
    const updatedData: any = { ...userData };
    if (userData.password) {
      updatedData.password = await bcrypt.hash(userData.password, 10);
    }
    
    mockUsers[index] = {
      ...mockUsers[index],
      ...updatedData,
      updatedAt: new Date(),
    };
    
    return mockUsers[index];
  }

  async deleteUser(id: number): Promise<boolean> {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    mockUsers.splice(index, 1);
    return true;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return [...mockProducts];
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return mockProducts.find(p => p.id === id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const abbreviation = this.generateShortcode(insertProduct.name);
    const position = await this.getNextAvailablePosition();
    
    const product: Product = {
      id: this.nextProductId++,
      name: insertProduct.name,
      abbreviation,
      description: insertProduct.description ?? "",
      category: insertProduct.category,
      status: insertProduct.status,
      url: insertProduct.url || null,
      positionX: position.x,
      positionY: position.y,
      launchDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockProducts.push(product);
    return product;
  }

  private generateShortcode(name: string): string {
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 3);
  }

  private async getNextAvailablePosition(): Promise<{ x: number; y: number }> {
    const existingProducts = await this.getProducts();
    const occupiedPositions = new Set(
      existingProducts.map(p => `${p.positionX},${p.positionY}`)
    );

    const maxCols = 4;
    
    for (let y = 1; y <= 20; y++) {
      for (let x = 1; x <= maxCols; x++) {
        const position = `${x},${y}`;
        if (!occupiedPositions.has(position)) {
          return { x, y };
        }
      }
    }

    return { x: 1, y: 21 };
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...updateData as any,
      updatedAt: new Date(),
    };
    
    return mockProducts[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProducts.splice(index, 1);
    return true;
  }

  // Content management
  async getContentSections(): Promise<ContentSection[]> {
    return [];
  }

  async getContentSection(sectionKey: string): Promise<ContentSection | undefined> {
    return undefined;
  }

  async createContentSection(section: InsertContentSection): Promise<ContentSection> {
    const newSection: ContentSection = {
      id: this.nextContentId++,
      sectionKey: section.sectionKey,
      title: section.title || null,
      content: section.content || null,
      metadata: {},
      isActive: section.isActive ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newSection;
  }

  async updateContentSection(id: number, updateData: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    return undefined;
  }

  async deleteContentSection(id: number): Promise<boolean> {
    return false;
  }
}

export const storage = new MemoryStorage();