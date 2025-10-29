import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
  WhereFilterOp,
} from 'firebase/firestore';
import { db } from '../../../config/firebase';

export interface BaseDocument {
  id?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  createdByUid?: string;
}

export interface QueryOptions {
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limitCount?: number;
  startAfterDoc?: any;
  filters?: Array<{
    field: string;
    operator: WhereFilterOp;
    value: any;
  }>;
}

export interface PaginationResult<T> {
  data: T[];
  lastDoc: any;
  hasMore: boolean;
}


export abstract class BaseFirebaseService<T extends BaseDocument> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  
  protected getCollection() {
    return collection(db, this.collectionName);
  }

  
  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

 
  protected addTimestamps<U>(data: U, isUpdate = false): any {
    const timestamp = serverTimestamp();
    
    if (isUpdate) {
      return {
        ...data,
        updatedAt: timestamp,
      };
    }
    
    return {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }


  protected docToObject(docSnap: any): T {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as T;
  }


  async create(data: Omit<T, 'id'>, userId?: string): Promise<T> {
    try {
      const dataWithTimestamps = this.addTimestamps({
        ...data,
        ...(userId && { createdByUid: userId }),
      });

      const docRef = await addDoc(this.getCollection(), dataWithTimestamps);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Failed to create document');
      }

      return this.docToObject(docSnap);
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return this.docToObject(docSnap);
    } catch (error) {
      console.error(`Error getting document ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getAll(options?: QueryOptions): Promise<T[]> {
    try {
      const constraints: QueryConstraint[] = [];

      
      if (options?.filters) {
        options.filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }

      
      if (options?.orderByField) {
        constraints.push(
          orderBy(options.orderByField, options.orderDirection || 'asc')
        );
      }

   
      if (options?.limitCount) {
        constraints.push(limit(options.limitCount));
      }

      const q = query(this.getCollection(), ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => this.docToObject(doc));
    } catch (error) {
      console.error(`Error getting all documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

 
  async getPaginated(
    pageSize: number = 10,
    options?: QueryOptions
  ): Promise<PaginationResult<T>> {
    try {
      const constraints: QueryConstraint[] = [];

      if (options?.filters) {
        options.filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }

      if (options?.orderByField) {
        constraints.push(
          orderBy(options.orderByField, options.orderDirection || 'asc')
        );
      }

      if (options?.startAfterDoc) {
        constraints.push(startAfter(options.startAfterDoc));
      }

      constraints.push(limit(pageSize + 1));

      const q = query(this.getCollection(), ...constraints);
      const querySnapshot = await getDocs(q);

      const docs = querySnapshot.docs;
      const hasMore = docs.length > pageSize;
      const data = docs.slice(0, pageSize).map(doc => this.docToObject(doc));
      const lastDoc = hasMore ? docs[pageSize - 1] : null;

      return {
        data,
        lastDoc,
        hasMore,
      };
    } catch (error) {
      console.error(`Error getting paginated documents from ${this.collectionName}:`, error);
      throw error;
    }
  }


  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const docRef = this.getDocRef(id);
      const dataWithTimestamps = this.addTimestamps(data, true);

      await updateDoc(docRef, dataWithTimestamps);

      const updatedDoc = await this.getById(id);
      if (!updatedDoc) {
        throw new Error('Failed to update document');
      }

      return updatedDoc;
    } catch (error) {
      console.error(`Error updating document ${id} in ${this.collectionName}:`, error);
      throw error;
    }
  }

 
  async delete(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const docRef = this.getDocRef(id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error(`Error checking if document ${id} exists in ${this.collectionName}:`, error);
      return false;
    }
  }

 
  async count(options?: QueryOptions): Promise<number> {
    try {
      const docs = await this.getAll(options);
      return docs.length;
    } catch (error) {
      console.error(`Error counting documents in ${this.collectionName}:`, error);
      throw error;
    }
  }
}