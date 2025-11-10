
import { Timestamp } from 'firebase/firestore';

export interface Work {
  id?: string;
  title: string;
  locale: 'uk' | 'en';
  status: 'draft' | 'published' | 'archived';
  
  customerInitials: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vinHashed: string;
  
  manufacturerId: string;
  injectorId: string;
  services: string[];
  workDate: Timestamp | Date;
  
  beforeImageURLs: string[];
  afterImageURLs: string[];
  
  testimonial?: string;
  
  technicianUid: string;
  createdByUid: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface WorkFormData {
  title: string;
  locale: 'uk' | 'en';
  status: 'draft' | 'published' | 'archived';
  customerInitials: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vinHashed: string;
  manufacturerId: string;
  injectorId: string;
  services: string[];
  workDate: Date;
  beforeImageURLs: string[];
  afterImageURLs: string[];
  testimonial: string;
  technicianUid: string;
}