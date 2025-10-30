import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { AppData, Service, Quote, Company, Settings } from './types';
import { seedData } from './seed';

interface ArCleanDB extends DBSchema {
  services: {
    key: string;
    value: Service;
    indexes: { 'by-category': string };
  };
  quotes: {
    key: string;
    value: Quote;
    indexes: { 'by-date': string; 'by-status': string };
  };
  settings: {
    key: string;
    value: Company | Settings;
  };
}

const DB_NAME = 'arclean-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<ArCleanDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<ArCleanDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<ArCleanDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Services store
      if (!db.objectStoreNames.contains('services')) {
        const servicesStore = db.createObjectStore('services', { keyPath: 'id' });
        servicesStore.createIndex('by-category', 'category');
      }

      // Quotes store
      if (!db.objectStoreNames.contains('quotes')) {
        const quotesStore = db.createObjectStore('quotes', { keyPath: 'id' });
        quotesStore.createIndex('by-date', 'date');
        quotesStore.createIndex('by-status', 'status');
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });

  // Check if we need to seed
  await seedDatabaseIfEmpty(dbInstance);

  return dbInstance;
}

async function seedDatabaseIfEmpty(db: IDBPDatabase<ArCleanDB>) {
  const serviceCount = await db.count('services');
  
  if (serviceCount === 0) {
    console.log('Seeding database with initial data...');
    
    // Seed services
    const tx = db.transaction(['services', 'settings'], 'readwrite');
    
    for (const service of seedData.services) {
      await tx.objectStore('services').add(service);
    }
    
    // Seed company settings
    await tx.objectStore('settings').add({ key: 'company', ...seedData.company });
    
    // Seed app settings
    await tx.objectStore('settings').add({ key: 'settings', ...seedData.settings });
    
    await tx.done;
    console.log('Database seeded successfully');
  }
}

// Services
export async function getServices(): Promise<Service[]> {
  const db = await initDB();
  return db.getAll('services');
}

export async function getServicesByCategory(category: string): Promise<Service[]> {
  const db = await initDB();
  return db.getAllFromIndex('services', 'by-category', category);
}

export async function getService(id: string): Promise<Service | undefined> {
  const db = await initDB();
  return db.get('services', id);
}

export async function addService(service: Service): Promise<void> {
  const db = await initDB();
  await db.add('services', service);
}

export async function updateService(service: Service): Promise<void> {
  const db = await initDB();
  await db.put('services', service);
}

export async function deleteService(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('services', id);
}

// Quotes
export async function getQuotes(): Promise<Quote[]> {
  const db = await initDB();
  const quotes = await db.getAll('quotes');
  return quotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getQuote(id: string): Promise<Quote | undefined> {
  const db = await initDB();
  return db.get('quotes', id);
}

export async function addQuote(quote: Quote): Promise<void> {
  const db = await initDB();
  await db.add('quotes', quote);
}

export async function updateQuote(quote: Quote): Promise<void> {
  const db = await initDB();
  await db.put('quotes', quote);
}

export async function deleteQuote(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('quotes', id);
}

// Settings
export async function getCompany(): Promise<Company> {
  const db = await initDB();
  const result = await db.get('settings', 'company');
  if (!result) return seedData.company;
  const { key, ...company } = result as any;
  return company as Company;
}

export async function updateCompany(company: Company): Promise<void> {
  const db = await initDB();
  await db.put('settings', { key: 'company', ...company });
}

export async function getSettings(): Promise<Settings> {
  const db = await initDB();
  const result = await db.get('settings', 'settings');
  if (!result) return seedData.settings;
  const { key, ...settings } = result as any;
  return settings as Settings;
}

export async function updateSettings(settings: Settings): Promise<void> {
  const db = await initDB();
  await db.put('settings', { key: 'settings', ...settings });
}

// Backup and restore
export async function exportData(): Promise<AppData> {
  const db = await initDB();
  const [services, quotes, company, settings] = await Promise.all([
    db.getAll('services'),
    db.getAll('quotes'),
    getCompany(),
    getSettings(),
  ]);

  return { company, settings, services, quotes };
}

export async function importData(data: AppData): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(['services', 'quotes', 'settings'], 'readwrite');

  // Clear existing data
  await tx.objectStore('services').clear();
  await tx.objectStore('quotes').clear();

  // Import services
  for (const service of data.services) {
    await tx.objectStore('services').add(service);
  }

  // Import quotes
  for (const quote of data.quotes) {
    await tx.objectStore('quotes').add(quote);
  }

  // Import settings
  await tx.objectStore('settings').put({ key: 'company', ...data.company });
  await tx.objectStore('settings').put({ key: 'settings', ...data.settings });

  await tx.done;
}

// Fallback to localStorage if IndexedDB fails
export function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(`arclean_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`arclean_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to get from localStorage:', error);
    return defaultValue;
  }
}
