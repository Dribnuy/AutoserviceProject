
import { BaseFirebaseService, BaseDocument } from './BaseFirebaseService';

export interface Injector extends BaseDocument {
  name: string;
  partNumber: string;
  slug: string;
  manufacturerId: string;
  mainImageURL: string;
  oemNumbers: string[];
  specifications: {
    pressure: string;
    flowRate: string;
    voltage: string;
    nozzleType?: string;
    resistance?: string;
  };
  vehicles: string[];
  tags: string[];
  isActive: boolean;
  price?: number;
  stock?: number;
}

class InjectorService extends BaseFirebaseService<Injector> {
  constructor() {
    super('injectors');
  }

  
  async getBySlug(slug: string): Promise<Injector | null> {
    try {
      const results = await this.getAll({
        filters: [{ field: 'slug', operator: '==', value: slug }],
        limitCount: 1,
      });

      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(`Error getting injector by slug ${slug}:`, error);
      throw error;
    }
  }

  
  async getByPartNumber(partNumber: string): Promise<Injector | null> {
    try {
      const results = await this.getAll({
        filters: [{ field: 'partNumber', operator: '==', value: partNumber }],
        limitCount: 1,
      });

      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(`Error getting injector by part number ${partNumber}:`, error);
      throw error;
    }
  }

  
  async getActive(): Promise<Injector[]> {
    try {
      return await this.getAll({
        filters: [{ field: 'isActive', operator: '==', value: true }],
        orderByField: 'name',
        orderDirection: 'asc',
      });
    } catch (error) {
      console.error('Error getting active injectors:', error);
      throw error;
    }
  }

  
  async getByManufacturer(manufacturerId: string): Promise<Injector[]> {
    try {
      return await this.getAll({
        filters: [
          { field: 'isActive', operator: '==', value: true },
          { field: 'manufacturerId', operator: '==', value: manufacturerId },
        ],
        orderByField: 'name',
        orderDirection: 'asc',
      });
    } catch (error) {
      console.error(`Error getting injectors by manufacturer ${manufacturerId}:`, error);
      throw error;
    }
  }

 
  async getByVehicle(vehicleName: string): Promise<Injector[]> {
    try {
      return await this.getAll({
        filters: [
          { field: 'isActive', operator: '==', value: true },
          { field: 'vehicles', operator: 'array-contains', value: vehicleName },
        ],
        orderByField: 'name',
        orderDirection: 'asc',
      });
    } catch (error) {
      console.error(`Error getting injectors by vehicle ${vehicleName}:`, error);
      throw error;
    }
  }

 
  async getByTag(tag: string): Promise<Injector[]> {
    try {
      return await this.getAll({
        filters: [
          { field: 'isActive', operator: '==', value: true },
          { field: 'tags', operator: 'array-contains', value: tag },
        ],
        orderByField: 'name',
        orderDirection: 'asc',
      });
    } catch (error) {
      console.error(`Error getting injectors by tag ${tag}:`, error);
      throw error;
    }
  }

  
  async createInjector(data: Omit<Injector, 'id'>, userId?: string): Promise<Injector> {
    try {
      const existingBySlug = await this.getBySlug(data.slug);
      if (existingBySlug) {
        throw new Error(`Injector with slug "${data.slug}" already exists`);
      }

      const existingByPartNumber = await this.getByPartNumber(data.partNumber);
      if (existingByPartNumber) {
        throw new Error(`Injector with part number "${data.partNumber}" already exists`);
      }

      return await this.create(data, userId);
    } catch (error) {
      console.error('Error creating injector:', error);
      throw error;
    }
  }

  
  async toggleActive(injectorId: string, isActive: boolean): Promise<Injector> {
    try {
      return await this.update(injectorId, { isActive });
    } catch (error) {
      console.error(`Error toggling active status for injector ${injectorId}:`, error);
      throw error;
    }
  }

 
  async updateStock(injectorId: string, stock: number): Promise<Injector> {
    try {
      return await this.update(injectorId, { stock });
    } catch (error) {
      console.error(`Error updating stock for injector ${injectorId}:`, error);
      throw error;
    }
  }

  async updatePrice(injectorId: string, price: number): Promise<Injector> {
    try {
      return await this.update(injectorId, { price });
    } catch (error) {
      console.error(`Error updating price for injector ${injectorId}:`, error);
      throw error;
    }
  }

  
  async search(searchTerm: string): Promise<Injector[]> {
    try {
      const allInjectors = await this.getActive();
      
      const searchLower = searchTerm.toLowerCase();
      return allInjectors.filter(injector => 
        injector.name.toLowerCase().includes(searchLower) ||
        injector.partNumber.toLowerCase().includes(searchLower) ||
        injector.oemNumbers.some(oemNum => oemNum.toLowerCase().includes(searchLower)) ||
        injector.vehicles.some(vehicle => vehicle.toLowerCase().includes(searchLower)) ||
        injector.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error(`Error searching injectors with term "${searchTerm}":`, error);
      throw error;
    }
  }

  
 
  async getInStock(): Promise<Injector[]> {
    try {
      const allActive = await this.getActive();
      return allActive.filter(injector => 
        injector.stock !== undefined && injector.stock > 0
      );
    } catch (error) {
      console.error('Error getting injectors in stock:', error);
      throw error;
    }
  }
}

export const injectorService = new InjectorService();