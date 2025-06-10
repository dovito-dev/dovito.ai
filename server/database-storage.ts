import { db } from "./db";
import { users, products, contentSections, formSubmissions, type User, type Product, type ContentSection, type FormSubmission, type InsertUser, type InsertProduct, type InsertContentSection, type InsertFormSubmission } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
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

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async changeUserPassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const updateData: any = { ...userData, updatedAt: new Date() };
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const abbreviation = insertProduct.abbreviation || this.generateShortcode(insertProduct.name);
    const position = await this.getNextAvailablePosition();
    
    const [product] = await db
      .insert(products)
      .values({
        ...insertProduct,
        abbreviation,
        positionX: position.x,
        positionY: position.y,
      })
      .returning();
    return product;
  }

  private generateShortcode(name: string): string {
    const words = name.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 0) return "Xx";
    if (words.length === 1) {
      const word = words[0];
      return word[0].toUpperCase() + (word[1] || 'x').toLowerCase();
    }
    
    return words[0][0].toUpperCase() + words[1][0].toLowerCase();
  }

  private async getNextAvailablePosition(): Promise<{ x: number; y: number }> {
    const existingProducts = await this.getProducts();
    const maxCols = 4;
    const occupiedPositions = new Set(
      existingProducts.map(p => `${p.positionX},${p.positionY}`)
    );

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
    const [product] = await db
      .update(products)
      .set({ ...updateData as any, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    
    if (result.rowCount > 0) {
      await this.reorganizePositions();
      return true;
    }
    return false;
  }

  private async reorganizePositions(): Promise<void> {
    const allProducts = await this.getProducts();
    const sortedProducts = allProducts.sort((a, b) => {
      if (a.positionY !== b.positionY) {
        return a.positionY - b.positionY;
      }
      return a.positionX - b.positionX;
    });

    const maxCols = 4;
    let currentX = 1;
    let currentY = 1;

    for (const product of sortedProducts) {
      await db
        .update(products)
        .set({
          positionX: currentX,
          positionY: currentY,
          updatedAt: new Date(),
        })
        .where(eq(products.id, product.id));

      currentX++;
      if (currentX > maxCols) {
        currentX = 1;
        currentY++;
      }
    }
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
    return section;
  }

  async createContentSection(section: InsertContentSection): Promise<ContentSection> {
    const [newSection] = await db
      .insert(contentSections)
      .values(section)
      .returning();
    return newSection;
  }

  async updateContentSection(id: number, updateData: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const [section] = await db
      .update(contentSections)
      .set({ ...updateData as any, updatedAt: new Date() })
      .where(eq(contentSections.id, id))
      .returning();
    return section;
  }

  async deleteContentSection(id: number): Promise<boolean> {
    const result = await db.delete(contentSections).where(eq(contentSections.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();