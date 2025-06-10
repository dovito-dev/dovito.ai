import {
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type ContentSection,
  type InsertContentSection,
} from "@shared/schema";
import { nocoService, type NocoProduct, type NocoUser, type NocoContentSection } from "./nocodb";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  changeUserPassword(userId: number, newPassword: string): Promise<void>;
  
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

export class NocoStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const nocoUser = await nocoService.getUser(id);
    if (!nocoUser) return undefined;
    
    return {
      id: nocoUser.id!,
      username: nocoUser.username,
      password: nocoUser.password_hash,
      email: nocoUser.email || "",
      role: nocoUser.role,
      createdAt: nocoUser.created_at ? new Date(nocoUser.created_at) : new Date(),
      updatedAt: nocoUser.updated_at ? new Date(nocoUser.updated_at) : new Date(),
    };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const nocoUser = await nocoService.getUserByUsername(username);
    if (!nocoUser) return undefined;
    
    return {
      id: nocoUser.id!,
      username: nocoUser.username,
      password: nocoUser.password_hash,
      email: nocoUser.email || "",
      role: nocoUser.role,
      createdAt: nocoUser.created_at ? new Date(nocoUser.created_at) : new Date(),
      updatedAt: nocoUser.updated_at ? new Date(nocoUser.updated_at) : new Date(),
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const nocoUser = await nocoService.createUser({
      username: insertUser.username,
      password_hash: hashedPassword,
      email: insertUser.email,
      role: insertUser.role,
    });
    
    return {
      id: nocoUser.id!,
      username: nocoUser.username,
      password: nocoUser.password_hash,
      email: nocoUser.email || "",
      role: nocoUser.role,
      createdAt: nocoUser.created_at ? new Date(nocoUser.created_at) : new Date(),
      updatedAt: nocoUser.updated_at ? new Date(nocoUser.updated_at) : new Date(),
    };
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async getAllUsers(): Promise<User[]> {
    const nocoUsers = await nocoService.getUsers();
    return nocoUsers.map(nocoUser => ({
      id: nocoUser.id!,
      username: nocoUser.username,
      password: nocoUser.password_hash,
      email: nocoUser.email || "",
      role: nocoUser.role,
      createdAt: nocoUser.created_at ? new Date(nocoUser.created_at) : new Date(),
      updatedAt: nocoUser.updated_at ? new Date(nocoUser.updated_at) : new Date(),
    }));
  }

  async changeUserPassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await nocoService.updateUser(userId, { password_hash: hashedPassword });
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    const nocoProducts = await nocoService.getProducts();
    return nocoProducts.map(nocoProduct => ({
      id: nocoProduct.id!,
      name: nocoProduct.name,
      abbreviation: nocoProduct.abbreviation,
      description: nocoProduct.description || "",
      category: nocoProduct.category,
      status: nocoProduct.status,
      url: nocoProduct.url || "",
      positionX: nocoProduct.position_x,
      positionY: nocoProduct.position_y,
      createdAt: nocoProduct.created_at ? new Date(nocoProduct.created_at) : new Date(),
      updatedAt: nocoProduct.updated_at ? new Date(nocoProduct.updated_at) : new Date(),
    }));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const nocoProduct = await nocoService.getProduct(id);
    if (!nocoProduct) return undefined;
    
    return {
      id: nocoProduct.id!,
      name: nocoProduct.name,
      abbreviation: nocoProduct.abbreviation,
      description: nocoProduct.description || "",
      category: nocoProduct.category,
      status: nocoProduct.status,
      url: nocoProduct.url || "",
      positionX: nocoProduct.position_x,
      positionY: nocoProduct.position_y,
      createdAt: nocoProduct.created_at ? new Date(nocoProduct.created_at) : new Date(),
      updatedAt: nocoProduct.updated_at ? new Date(nocoProduct.updated_at) : new Date(),
    };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    // Generate abbreviation from name
    const abbreviation = this.generateShortcode(insertProduct.name);
    
    // Get next available position
    const position = await this.getNextAvailablePosition();
    
    const nocoProduct = await nocoService.createProduct({
      name: insertProduct.name,
      abbreviation,
      description: insertProduct.description,
      category: insertProduct.category,
      status: insertProduct.status,
      url: insertProduct.url,
      position_x: position.x,
      position_y: position.y,
    });
    
    return {
      id: nocoProduct.id!,
      name: nocoProduct.name,
      abbreviation: nocoProduct.abbreviation,
      description: nocoProduct.description || "",
      category: nocoProduct.category,
      status: nocoProduct.status,
      url: nocoProduct.url || "",
      positionX: nocoProduct.position_x,
      positionY: nocoProduct.position_y,
      createdAt: nocoProduct.created_at ? new Date(nocoProduct.created_at) : new Date(),
      updatedAt: nocoProduct.updated_at ? new Date(nocoProduct.updated_at) : new Date(),
    };
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

    // Use 4-column grid layout to match frontend display
    const maxCols = 4;
    
    // Find the first available position going left to right, top to bottom
    for (let y = 1; y <= 20; y++) {
      for (let x = 1; x <= maxCols; x++) {
        const position = `${x},${y}`;
        if (!occupiedPositions.has(position)) {
          return { x, y };
        }
      }
    }

    // Fallback - should rarely be needed
    return { x: 1, y: 21 };
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const updatePayload: Partial<NocoProduct> = {};
    
    if (updateData.name) updatePayload.name = updateData.name;
    if (updateData.abbreviation) updatePayload.abbreviation = updateData.abbreviation;
    if (updateData.description) updatePayload.description = updateData.description;
    if (updateData.category) updatePayload.category = updateData.category;
    if (updateData.status) updatePayload.status = updateData.status;
    if (updateData.url) updatePayload.url = updateData.url;
    
    const nocoProduct = await nocoService.updateProduct(id, updatePayload);
    if (!nocoProduct) return undefined;
    
    return {
      id: nocoProduct.id!,
      name: nocoProduct.name,
      abbreviation: nocoProduct.abbreviation,
      description: nocoProduct.description || "",
      category: nocoProduct.category,
      status: nocoProduct.status,
      url: nocoProduct.url || "",
      positionX: nocoProduct.position_x,
      positionY: nocoProduct.position_y,
      createdAt: nocoProduct.created_at ? new Date(nocoProduct.created_at) : new Date(),
      updatedAt: nocoProduct.updated_at ? new Date(nocoProduct.updated_at) : new Date(),
    };
  }

  async deleteProduct(id: number): Promise<boolean> {
    return await nocoService.deleteProduct(id);
  }

  // Content management
  async getContentSections(): Promise<ContentSection[]> {
    const nocoSections = await nocoService.getContentSections();
    return nocoSections.map(nocoSection => ({
      id: nocoSection.id!,
      sectionKey: nocoSection.section_key,
      title: nocoSection.title,
      content: nocoSection.content,
      order: nocoSection.order,
      isActive: nocoSection.is_active,
      createdAt: nocoSection.created_at ? new Date(nocoSection.created_at) : new Date(),
      updatedAt: nocoSection.updated_at ? new Date(nocoSection.updated_at) : new Date(),
    }));
  }

  async getContentSection(sectionKey: string): Promise<ContentSection | undefined> {
    const nocoSection = await nocoService.getContentSection(sectionKey);
    if (!nocoSection) return undefined;
    
    return {
      id: nocoSection.id!,
      sectionKey: nocoSection.section_key,
      title: nocoSection.title,
      content: nocoSection.content,
      order: nocoSection.order,
      isActive: nocoSection.is_active,
      createdAt: nocoSection.created_at ? new Date(nocoSection.created_at) : new Date(),
      updatedAt: nocoSection.updated_at ? new Date(nocoSection.updated_at) : new Date(),
    };
  }

  async createContentSection(section: InsertContentSection): Promise<ContentSection> {
    const nocoSection = await nocoService.createContentSection({
      section_key: section.sectionKey,
      title: section.title,
      content: section.content,
      order: section.order,
      is_active: section.isActive,
    });
    
    return {
      id: nocoSection.id!,
      sectionKey: nocoSection.section_key,
      title: nocoSection.title,
      content: nocoSection.content,
      order: nocoSection.order,
      isActive: nocoSection.is_active,
      createdAt: nocoSection.created_at ? new Date(nocoSection.created_at) : new Date(),
      updatedAt: nocoSection.updated_at ? new Date(nocoSection.updated_at) : new Date(),
    };
  }

  async updateContentSection(id: number, updateData: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const updatePayload: Partial<NocoContentSection> = {};
    
    if (updateData.sectionKey) updatePayload.section_key = updateData.sectionKey;
    if (updateData.title) updatePayload.title = updateData.title;
    if (updateData.content) updatePayload.content = updateData.content;
    if (updateData.order !== undefined) updatePayload.order = updateData.order;
    if (updateData.isActive !== undefined) updatePayload.is_active = updateData.isActive;
    
    const nocoSection = await nocoService.updateContentSection(id, updatePayload);
    if (!nocoSection) return undefined;
    
    return {
      id: nocoSection.id!,
      sectionKey: nocoSection.section_key,
      title: nocoSection.title,
      content: nocoSection.content,
      order: nocoSection.order,
      isActive: nocoSection.is_active,
      createdAt: nocoSection.created_at ? new Date(nocoSection.created_at) : new Date(),
      updatedAt: nocoSection.updated_at ? new Date(nocoSection.updated_at) : new Date(),
    };
  }

  async deleteContentSection(id: number): Promise<boolean> {
    return await nocoService.deleteContentSection(id);
  }
}

export const storage = new NocoStorage();