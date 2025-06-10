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
      role: insertUser.role || "user",
      firstName: null,
      lastName: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(user);
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
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
      description: insertProduct.description,
      category: insertProduct.category,
      status: insertProduct.status || "development",
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
    const existingAbbreviations = new Set(
      mockProducts.map(p => p.abbreviation.toLowerCase())
    );

    // Clean and split the name
    const words = name.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 0) return "Xx";

    // Try different strategies to generate a 2-character abbreviation
    const strategies = [
      // Strategy 1: First letter of first two words (capitalized)
      () => {
        if (words.length >= 2) {
          return words[0][0].toUpperCase() + words[1][0].toLowerCase();
        }
        return null;
      },
      
      // Strategy 2: First letter + second letter of first word
      () => {
        if (words[0].length >= 2) {
          return words[0][0].toUpperCase() + words[0][1].toLowerCase();
        }
        return null;
      },
      
      // Strategy 3: First letter + first consonant of first word
      () => {
        const consonants = words[0].slice(1).match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/);
        if (consonants) {
          return words[0][0].toUpperCase() + consonants[0].toLowerCase();
        }
        return null;
      },
      
      // Strategy 4: Try combinations from multiple words
      () => {
        if (words.length >= 2) {
          for (let i = 0; i < words[0].length && i < 2; i++) {
            for (let j = 0; j < words[1].length && j < 2; j++) {
              const combo = words[0][i].toUpperCase() + words[1][j].toLowerCase();
              if (!existingAbbreviations.has(combo.toLowerCase())) {
                return combo;
              }
            }
          }
        }
        return null;
      },
      
      // Strategy 5: Try different letter combinations from single word
      () => {
        const word = words[0];
        for (let i = 0; i < word.length - 1; i++) {
          for (let j = i + 1; j < word.length; j++) {
            const combo = word[i].toUpperCase() + word[j].toLowerCase();
            if (!existingAbbreviations.has(combo.toLowerCase())) {
              return combo;
            }
          }
        }
        return null;
      },
      
      // Strategy 6: Add numbers if all else fails
      () => {
        const base = words[0][0].toUpperCase() + (words[0][1] || words[1]?.[0] || 'x').toLowerCase();
        for (let i = 1; i <= 99; i++) {
          const combo = base.slice(0, 1) + i.toString().padStart(1, '0');
          if (!existingAbbreviations.has(combo.toLowerCase())) {
            return combo;
          }
        }
        return base;
      }
    ];

    // Try each strategy until we find an unused abbreviation
    for (const strategy of strategies) {
      const result = strategy();
      if (result && !existingAbbreviations.has(result.toLowerCase())) {
        return result;
      }
    }

    // Fallback - should never reach here
    return words[0][0].toUpperCase() + "x";
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
    
    // Reorganize positions to fill gaps
    await this.reorganizePositions();
    
    return true;
  }

  private async reorganizePositions(): Promise<void> {
    // Sort products by current position (row first, then column)
    const sortedProducts = mockProducts.sort((a, b) => {
      if (a.positionY !== b.positionY) {
        return a.positionY - b.positionY;
      }
      return a.positionX - b.positionX;
    });

    // Reassign positions in a tight grid
    const maxCols = 4;
    let currentX = 1;
    let currentY = 1;

    for (const product of sortedProducts) {
      product.positionX = currentX;
      product.positionY = currentY;
      product.updatedAt = new Date();

      currentX++;
      if (currentX > maxCols) {
        currentX = 1;
        currentY++;
      }
    }
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