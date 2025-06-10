import bcrypt from 'bcryptjs';
import { nocoService } from './server/nocodb.js';

async function setupDatabase() {
  try {
    console.log('Setting up database with initial data...');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('Great_Scott', 10);
    const adminUser = await nocoService.createUser({
      username: 'info@dovito.com',
      password_hash: hashedPassword,
      email: 'info@dovito.com',
      role: 'admin'
    });
    console.log('Admin user created:', adminUser.username);

    // Create initial products
    const products = [
      {
        name: "Prompt Engineer",
        abbreviation: "PE", 
        description: "AI prompt optimization and engineering",
        category: "AI Tools",
        status: "live",
        url: "",
        position_x: 1,
        position_y: 1
      },
      {
        name: "Septic Management",
        abbreviation: "SM",
        description: "Smart septic system management", 
        category: "Property",
        status: "live",
        url: "",
        position_x: 2,
        position_y: 1
      },
      {
        name: "Process Automation", 
        abbreviation: "PA",
        description: "Business process automation tools",
        category: "Business", 
        status: "live",
        url: "",
        position_x: 3,
        position_y: 1
      },
      {
        name: "Load Organizer",
        abbreviation: "LO", 
        description: "Logistics and load management",
        category: "Logistics",
        status: "live", 
        url: "",
        position_x: 4,
        position_y: 1
      }
    ];

    for (const product of products) {
      const created = await nocoService.createProduct(product);
      console.log('Product created:', created.name);
    }

    // Create initial content sections
    const contentSections = [
      {
        section_key: "periodic_table_title",
        title: "The Dovito Universe", 
        content: "The Dovito Universe",
        order: 1,
        is_active: true
      },
      {
        section_key: "periodic_table_description",
        title: "Periodic Table Description",
        content: "A growing ecosystem of automation tools designed to transform business operations", 
        order: 2,
        is_active: true
      },
      {
        section_key: "periodic_table_footer", 
        title: "Periodic Table Footer",
        content: "Click live products to visit • Click coming soon for early access",
        order: 3,
        is_active: true
      }
    ];

    for (const section of contentSections) {
      const created = await nocoService.createContentSection(section);
      console.log('Content section created:', created.section_key);
    }

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

setupDatabase();