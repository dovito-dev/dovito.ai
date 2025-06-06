import {
  users,
  products,
  contentSections,
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type ContentSection,
  type InsertContentSection,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  
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

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Content management
  async getContentSections(): Promise<ContentSection[]> {
    return await db.select().from(contentSections);
  }

  async getContentSection(sectionKey: string): Promise<ContentSection | undefined> {
    const [section] = await db
      .select()
      .from(contentSections)
      .where(eq(contentSections.sectionKey, sectionKey));
    return section || undefined;
  }

  async createContentSection(section: InsertContentSection): Promise<ContentSection> {
    const [created] = await db
      .insert(contentSections)
      .values(section)
      .returning();
    return created;
  }

  async updateContentSection(id: number, updateData: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const [section] = await db
      .update(contentSections)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(contentSections.id, id))
      .returning();
    return section || undefined;
  }

  async deleteContentSection(id: number): Promise<boolean> {
    const result = await db.delete(contentSections).where(eq(contentSections.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
