import { BaseFirebaseService, BaseDocument } from './BaseFirebaseService';

export interface Manufacturer extends BaseDocument {
  name: string;
  slug: string;
  description: string;
  logoURL: string;
  isActive: boolean;
  sortOrder: number;
}

class ManufacturerService extends BaseFirebaseService<Manufacturer> {
  constructor() {
    super('manufacturers');
  }

  
  async getBySlug(slug: string): Promise<Manufacturer | null> {
    try {
      const results = await this.getAll({
        filters: [{ field: 'slug', operator: '==', value: slug }],
        limitCount: 1,
      });

      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(`Error getting manufacturer by slug ${slug}:`, error);
      throw error;
    }
  }

  
  async getActive(): Promise<Manufacturer[]> {
    try {
      return await this.getAll({
        filters: [{ field: 'isActive', operator: '==', value: true }],
        orderByField: 'sortOrder',
        orderDirection: 'asc',
      });
    } catch (error) {
      console.error('Error getting active manufacturers:', error);
      throw error;
    }
  }

 
  async createManufacturer(data: Omit<Manufacturer, 'id'>, userId?: string): Promise<Manufacturer> {
    try {
      const existing = await this.getBySlug(data.slug);
      if (existing) {
        throw new Error(`Manufacturer with slug "${data.slug}" already exists`);
      }

      return await this.create(data, userId);
    } catch (error) {
      console.error('Error creating manufacturer:', error);
      throw error;
    }
  }


  async updateSortOrder(manufacturerId: string, newSortOrder: number): Promise<Manufacturer> {
    try {
      return await this.update(manufacturerId, { sortOrder: newSortOrder });
    } catch (error) {
      console.error(`Error updating sort order for manufacturer ${manufacturerId}:`, error);
      throw error;
    }
  }


  async toggleActive(manufacturerId: string, isActive: boolean): Promise<Manufacturer> {
    try {
      return await this.update(manufacturerId, { isActive });
    } catch (error) {
      console.error(`Error toggling active status for manufacturer ${manufacturerId}:`, error);
      throw error;
    }
  }
}

export const manufacturerService = new ManufacturerService();