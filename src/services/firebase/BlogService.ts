import { BaseFirebaseService, BaseDocument, PaginationResult } from './BaseFirebaseService';
import { Timestamp } from 'firebase/firestore';

export interface BlogPost extends BaseDocument {
  title: string;
  slug: string;
  excerpt: string;
  contentMw: string; 
  coverImageURL: string;
  locale: 'uk' | 'en';
  publishedAt: Timestamp | Date | null;
  states: 'draft' | 'published' | 'archived';
  tags: string[];
  category?: string;
  readTime?: string;
  views?: number;
}

class BlogService extends BaseFirebaseService<BlogPost> {
  constructor() {
    super('blog_posts');
  }

  async getBySlug(slug: string, locale: 'uk' | 'en'): Promise<BlogPost | null> {
    try {
      const results = await this.getAll({
        filters: [
          { field: 'slug', operator: '==', value: slug },
          { field: 'locale', operator: '==', value: locale },
        ],
        limitCount: 1,
      });

      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(`Error getting blog post by slug ${slug}:`, error);
      throw error;
    }
  }

 
  async getPublished(locale?: 'uk' | 'en'): Promise<BlogPost[]> {
    try {
      const filters: any[] = [{ field: 'states', operator: '==', value: 'published' }];
      
      if (locale) {
        filters.push({ field: 'locale', operator: '==', value: locale });
      }

      return await this.getAll({
        filters,
        orderByField: 'publishedAt',
        orderDirection: 'desc',
      });
    } catch (error) {
      console.error('Error getting published blog posts:', error);
      throw error;
    }
  }

  
  async getPublishedPaginated(
    pageSize: number = 6,
    locale?: 'uk' | 'en',
    lastDoc?: any
  ): Promise<PaginationResult<BlogPost>> {
    try {
      const filters: any[] = [{ field: 'states', operator: '==', value: 'published' }];
      
      if (locale) {
        filters.push({ field: 'locale', operator: '==', value: locale });
      }

      return await this.getPaginated(pageSize, {
        filters,
        orderByField: 'publishedAt',
        orderDirection: 'desc',
        startAfterDoc: lastDoc,
      });
    } catch (error) {
      console.error('Error getting paginated blog posts:', error);
      throw error;
    }
  }

  
  async getByTag(tag: string, locale?: 'uk' | 'en'): Promise<BlogPost[]> {
    try {
      const filters: any[] = [
        { field: 'states', operator: '==', value: 'published' },
        { field: 'tags', operator: 'array-contains', value: tag },
      ];
      
      if (locale) {
        filters.push({ field: 'locale', operator: '==', value: locale });
      }

      return await this.getAll({
        filters,
        orderByField: 'publishedAt',
        orderDirection: 'desc',
      });
    } catch (error) {
      console.error(`Error getting blog posts by tag ${tag}:`, error);
      throw error;
    }
  }


  async getByCategory(category: string, locale?: 'uk' | 'en'): Promise<BlogPost[]> {
    try {
      const filters: any[] = [
        { field: 'states', operator: '==', value: 'published' },
        { field: 'category', operator: '==', value: category },
      ];
      
      if (locale) {
        filters.push({ field: 'locale', operator: '==', value: locale });
      }

      return await this.getAll({
        filters,
        orderByField: 'publishedAt',
        orderDirection: 'desc',
      });
    } catch (error) {
      console.error(`Error getting blog posts by category ${category}:`, error);
      throw error;
    }
  }

  async createPost(data: Omit<BlogPost, 'id'>, userId?: string): Promise<BlogPost> {
    try {
      const existing = await this.getBySlug(data.slug, data.locale);
      if (existing) {
        throw new Error(`Blog post with slug "${data.slug}" already exists for locale "${data.locale}"`);
      }

      return await this.create(data, userId);
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

 
  async publish(postId: string): Promise<BlogPost> {
    try {
      return await this.update(postId, {
        states: 'published',
        publishedAt: new Date(),
      });
    } catch (error) {
      console.error(`Error publishing blog post ${postId}:`, error);
      throw error;
    }
  }

 
  async unpublish(postId: string): Promise<BlogPost> {
    try {
      return await this.update(postId, {
        states: 'draft',
      });
    } catch (error) {
      console.error(`Error unpublishing blog post ${postId}:`, error);
      throw error;
    }
  }

  
  async archive(postId: string): Promise<BlogPost> {
    try {
      return await this.update(postId, {
        states: 'archived',
      });
    } catch (error) {
      console.error(`Error archiving blog post ${postId}:`, error);
      throw error;
    }
  }

 
  async incrementViews(postId: string): Promise<void> {
    try {
      const post = await this.getById(postId);
      if (post) {
        await this.update(postId, {
          views: (post.views || 0) + 1,
        });
      }
    } catch (error) {
      console.error(`Error incrementing views for post ${postId}:`, error);
      throw error;
    }
  }

  
  async search(searchTerm: string, locale?: 'uk' | 'en'): Promise<BlogPost[]> {
    try {
      const allPosts = await this.getPublished(locale);
      
      const searchLower = searchTerm.toLowerCase();
      return allPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error(`Error searching blog posts with term "${searchTerm}":`, error);
      throw error;
    }
  }
}

export const blogService = new BlogService();