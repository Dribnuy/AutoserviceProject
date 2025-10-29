import { BaseFirebaseService, BaseDocument, PaginationResult } from './BaseFirebaseService';
import { Timestamp } from 'firebase/firestore';

export interface Work extends BaseDocument {
  title: string;
  customerInitials: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vinHashed: string; 
  injectorId?: string;
  manufacturerId: string;
  services: string[]; 
  testimonial?: string;
  beforeImageURLs: string[];
  afterImageURLs: string[];
  workDate: Timestamp | Date;
  locale: 'uk' | 'en';
  status: 'draft' | 'published' | 'archived';
  technicianUid?: string;
}

class WorksService extends BaseFirebaseService<Work> {
  constructor() {
    super('works');
  }

 
  async getPublished(locale?: 'uk' | 'en'): Promise<Work[]> {
    try {
      const filters: any[] = [{ field: 'status', operator: '==', value: 'published' }];
      
      if (locale) {
        filters.push({ field: 'locale', operator: '==', value: locale });
      }

      return await this.getAll({
        filters,
        orderByField: 'workDate',
        orderDirection: 'desc',
      });
    } catch (error) {
      console.error('Error getting published works:', error);
      throw error;
    }
  }

  
  async getPublishedPaginated(
    pageSize: number = 9,
    locale?: 'uk' | 'en',
    lastDoc?: any
  ): Promise<PaginationResult<Work>> {
    try {
      const filters: any[] = [{ field: 'status', operator: '==', value: 'published' }];
      
      if (locale) {
        filters.push({ field: 'locale', operator: '==', value: locale });
      }

      return await this.getPaginated(pageSize, {
        filters,
        orderByField: 'workDate',
        orderDirection: 'desc',
        startAfterDoc: lastDoc,
      });
    } catch (error) {
      console.error('Error getting paginated works:', error);
      throw error;
    }
  }

  
  async getByManufacturer(manufacturerId: string, locale?: 'uk' | 'en'): Promise<Work[]> {
    try {
      const filters: any[] = [
        { field: 'status', operator: '==', value: 'published' },
        { field: 'manufacturerId', operator: '==', value: manufacturerId },
      ];
      
      if (locale) {
        filters.push({ field: 'locale', operator: '==', value: locale });
      }

      return await this.getAll({
        filters,
        orderByField: 'workDate',
        orderDirection: 'desc',
      });
    } catch (error) {
      console.error(`Error getting works by manufacturer ${manufacturerId}:`, error);
      throw error;
    }
  }

 
  async getByInjector(injectorId: string): Promise<Work[]> {
    try {
      return await this.getAll({
        filters: [
          { field: 'status', operator: '==', value: 'published' },
          { field: 'injectorId', operator: '==', value: injectorId },
        ],
        orderByField: 'workDate',
        orderDirection: 'desc',
      });
    } catch (error) {
      console.error(`Error getting works by injector ${injectorId}:`, error);
      throw error;
    }
  }

  
  async getByVehicle(make: string, model?: string, locale?: 'uk' | 'en'): Promise<Work[]> {
    try {
      const filters: any[] = [
        { field: 'status', operator: '==', value: 'published' },
        { field: 'vehicleMake', operator: '==', value: make },
      ];
      
      if (model) {
        filters.push({ field: 'vehicleModel', operator: '==', value: model });
      }
      
      if (locale) {
        filters.push({ field: 'locale', operator: '==', value: locale });
      }

      return await this.getAll({
        filters,
        orderByField: 'workDate',
        orderDirection: 'desc',
      });
    } catch (error) {
      console.error(`Error getting works by vehicle ${make} ${model || ''}:`, error);
      throw error;
    }
  }

  
  async getByTechnician(technicianUid: string): Promise<Work[]> {
    try {
      return await this.getAll({
        filters: [
          { field: 'status', operator: '==', value: 'published' },
          { field: 'technicianUid', operator: '==', value: technicianUid },
        ],
        orderByField: 'workDate',
        orderDirection: 'desc',
      });
    } catch (error) {
      console.error(`Error getting works by technician ${technicianUid}:`, error);
      throw error;
    }
  }

  
  async createWork(data: Omit<Work, 'id'>, userId?: string): Promise<Work> {
    try {
      return await this.create(data, userId);
    } catch (error) {
      console.error('Error creating work:', error);
      throw error;
    }
  }

 
  async publish(workId: string): Promise<Work> {
    try {
      return await this.update(workId, {
        status: 'published',
      });
    } catch (error) {
      console.error(`Error publishing work ${workId}:`, error);
      throw error;
    }
  }

  async unpublish(workId: string): Promise<Work> {
    try {
      return await this.update(workId, {
        status: 'draft',
      });
    } catch (error) {
      console.error(`Error unpublishing work ${workId}:`, error);
      throw error;
    }
  }

  async archive(workId: string): Promise<Work> {
    try {
      return await this.update(workId, {
        status: 'archived',
      });
    } catch (error) {
      console.error(`Error archiving work ${workId}:`, error);
      throw error;
    }
  }

  
  async getRecent(count: number = 6, locale?: 'uk' | 'en'): Promise<Work[]> {
    try {
      const filters: any[] = [{ field: 'status', operator: '==', value: 'published' }];
      
      if (locale) {
        filters.push({ field: 'locale', operator: '==', value: locale });
      }

      return await this.getAll({
        filters,
        orderByField: 'workDate',
        orderDirection: 'desc',
        limitCount: count,
      });
    } catch (error) {
      console.error('Error getting recent works:', error);
      throw error;
    }
  }


  async search(searchTerm: string, locale?: 'uk' | 'en'): Promise<Work[]> {
    try {
      const allWorks = await this.getPublished(locale);
      
      const searchLower = searchTerm.toLowerCase();
      return allWorks.filter(work => 
        work.title.toLowerCase().includes(searchLower) ||
        work.vehicleMake.toLowerCase().includes(searchLower) ||
        work.vehicleModel.toLowerCase().includes(searchLower) ||
        work.services.some(service => service.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error(`Error searching works with term "${searchTerm}":`, error);
      throw error;
    }
  }
}

export const worksService = new WorksService();