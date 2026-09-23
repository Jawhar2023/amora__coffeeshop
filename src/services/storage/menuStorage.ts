import { readKey, writeKey, StorageKeys, uid } from './storageService';
import type { Category, Product, AddOnGroup } from '@/types';

// ---------- Categories ----------
export const CategoryRepository = {
  getAll(): Category[] {
    return readKey<Category[]>(StorageKeys.categories, []).sort((a, b) => a.order - b.order);
  },
  getById(id: string): Category | undefined {
    return this.getAll().find((c) => c.id === id);
  },
  save(all: Category[]): void {
    writeKey(StorageKeys.categories, all);
  },
  create(data: Omit<Category, 'id'>): Category {
    const item: Category = { ...data, id: uid('cat') };
    this.save([...this.getAll(), item]);
    return item;
  },
  update(id: string, patch: Partial<Category>): void {
    this.save(this.getAll().map((c) => (c.id === id ? { ...c, ...patch } : c)));
  },
  remove(id: string): void {
    this.save(this.getAll().filter((c) => c.id !== id));
  },
  reorder(orderedIds: string[]): void {
    const all = this.getAll();
    this.save(all.map((c) => ({ ...c, order: orderedIds.indexOf(c.id) })));
  },
};

// ---------- Products ----------
export const ProductRepository = {
  getAll(): Product[] {
    return readKey<Product[]>(StorageKeys.products, []);
  },
  getById(id: string): Product | undefined {
    return this.getAll().find((p) => p.id === id);
  },
  getByCategory(categoryId: string): Product[] {
    return this.getAll().filter((p) => p.categoryId === categoryId);
  },
  save(all: Product[]): void {
    writeKey(StorageKeys.products, all);
  },
  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const now = new Date().toISOString();
    const item: Product = { ...data, id: uid('prod'), createdAt: now, updatedAt: now };
    this.save([...this.getAll(), item]);
    return item;
  },
  update(id: string, patch: Partial<Product>): void {
    this.save(
      this.getAll().map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
      )
    );
  },
  remove(id: string): void {
    this.save(this.getAll().filter((p) => p.id !== id));
  },
};

// ---------- Add-on groups ----------
export const AddOnRepository = {
  getAll(): AddOnGroup[] {
    return readKey<AddOnGroup[]>(StorageKeys.addOnGroups, []);
  },
  getByIds(ids: string[]): AddOnGroup[] {
    const all = this.getAll();
    return ids.map((id) => all.find((g) => g.id === id)).filter((g): g is AddOnGroup => !!g);
  },
  save(all: AddOnGroup[]): void {
    writeKey(StorageKeys.addOnGroups, all);
  },
  create(data: Omit<AddOnGroup, 'id'>): AddOnGroup {
    const item: AddOnGroup = { ...data, id: uid('addon') };
    this.save([...this.getAll(), item]);
    return item;
  },
  update(id: string, patch: Partial<AddOnGroup>): void {
    this.save(this.getAll().map((g) => (g.id === id ? { ...g, ...patch } : g)));
  },
  remove(id: string): void {
    this.save(this.getAll().filter((g) => g.id !== id));
  },
};
