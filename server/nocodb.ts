import axios from 'axios';

if (!process.env.NOCODB_API_BASE_URL || !process.env.NOCODB_API_TOKEN) {
  throw new Error("NOCODB_API_BASE_URL and NOCODB_API_TOKEN must be set");
}

const nocoClient = axios.create({
  baseURL: process.env.NOCODB_API_BASE_URL,
  headers: {
    'xc-token': process.env.NOCODB_API_TOKEN,
    'Content-Type': 'application/json',
  },
});

export interface NocoProduct {
  id?: number;
  name: string;
  abbreviation: string;
  description?: string;
  category: string;
  status: 'draft' | 'live';
  url?: string;
  position_x: number;
  position_y: number;
  created_at?: string;
  updated_at?: string;
}

export interface NocoUser {
  id?: number;
  username: string;
  password_hash: string;
  email?: string;
  role: 'admin' | 'user';
  created_at?: string;
  updated_at?: string;
}

export interface NocoContentSection {
  id?: number;
  section_key: string;
  title: string;
  content: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

class NocoDBService {
  // Products
  async getProducts(): Promise<NocoProduct[]> {
    try {
      const response = await nocoClient.get('/api/v1/db/data/noco/dovito/products');
      return response.data.list || [];
    } catch (error) {
      console.error('Error fetching products from NocoDB:', error);
      return [];
    }
  }

  async getProduct(id: number): Promise<NocoProduct | undefined> {
    try {
      const response = await nocoClient.get(`/api/v1/db/data/noco/dovito/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product from NocoDB:', error);
      return undefined;
    }
  }

  async createProduct(product: Omit<NocoProduct, 'id'>): Promise<NocoProduct> {
    const response = await nocoClient.post('/api/v1/db/data/noco/dovito/products', product);
    return response.data;
  }

  async updateProduct(id: number, product: Partial<NocoProduct>): Promise<NocoProduct | undefined> {
    try {
      const response = await nocoClient.patch(`/api/v1/db/data/noco/dovito/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error('Error updating product in NocoDB:', error);
      return undefined;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      await nocoClient.delete(`/api/v1/db/data/noco/dovito/products/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting product from NocoDB:', error);
      return false;
    }
  }

  // Users
  async getUsers(): Promise<NocoUser[]> {
    try {
      const response = await nocoClient.get('/api/v1/db/data/noco/dovito/users');
      return response.data.list || [];
    } catch (error) {
      console.error('Error fetching users from NocoDB:', error);
      return [];
    }
  }

  async getUser(id: number): Promise<NocoUser | undefined> {
    try {
      const response = await nocoClient.get(`/api/v1/db/data/noco/dovito/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user from NocoDB:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<NocoUser | undefined> {
    try {
      const response = await nocoClient.get(`/api/v1/db/data/noco/dovito/users?where=(username,eq,${username})`);
      const users = response.data.list || [];
      return users.length > 0 ? users[0] : undefined;
    } catch (error) {
      console.error('Error fetching user by username from NocoDB:', error);
      return undefined;
    }
  }

  async createUser(user: Omit<NocoUser, 'id'>): Promise<NocoUser> {
    const response = await nocoClient.post('/api/v1/db/data/noco/dovito/users', user);
    return response.data;
  }

  async updateUser(id: number, user: Partial<NocoUser>): Promise<NocoUser | undefined> {
    try {
      const response = await nocoClient.patch(`/api/v1/db/data/noco/dovito/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error('Error updating user in NocoDB:', error);
      return undefined;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await nocoClient.delete(`/api/v1/db/data/noco/dovito/users/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting user from NocoDB:', error);
      return false;
    }
  }

  // Content Sections
  async getContentSections(): Promise<NocoContentSection[]> {
    try {
      const response = await nocoClient.get('/api/v1/db/data/noco/dovito/content_sections');
      return response.data.list || [];
    } catch (error) {
      console.error('Error fetching content sections from NocoDB:', error);
      return [];
    }
  }

  async getContentSection(sectionKey: string): Promise<NocoContentSection | undefined> {
    try {
      const response = await nocoClient.get(`/api/v1/db/data/noco/dovito/content_sections?where=(section_key,eq,${sectionKey})`);
      const sections = response.data.list || [];
      return sections.length > 0 ? sections[0] : undefined;
    } catch (error) {
      console.error('Error fetching content section from NocoDB:', error);
      return undefined;
    }
  }

  async createContentSection(section: Omit<NocoContentSection, 'id'>): Promise<NocoContentSection> {
    const response = await nocoClient.post('/api/v1/db/data/noco/dovito/content_sections', section);
    return response.data;
  }

  async updateContentSection(id: number, section: Partial<NocoContentSection>): Promise<NocoContentSection | undefined> {
    try {
      const response = await nocoClient.patch(`/api/v1/db/data/noco/dovito/content_sections/${id}`, section);
      return response.data;
    } catch (error) {
      console.error('Error updating content section in NocoDB:', error);
      return undefined;
    }
  }

  async deleteContentSection(id: number): Promise<boolean> {
    try {
      await nocoClient.delete(`/api/v1/db/data/noco/dovito/content_sections/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting content section from NocoDB:', error);
      return false;
    }
  }
}

export const nocoService = new NocoDBService();