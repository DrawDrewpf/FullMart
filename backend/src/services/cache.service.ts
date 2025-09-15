// Simple in-memory cache service for development (when Redis is not available)
class SimpleCacheService {
  private cache: Map<string, { value: any; expires?: number }> = new Map();
  private enabled: boolean = true;

  constructor() {
    console.log('⚠️ Using in-memory cache (Redis not available)');
  }

  async get(key: string): Promise<any> {
    if (!this.enabled) return null;
    
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: any, expireInSeconds?: number): Promise<boolean> {
    if (!this.enabled) return false;
    
    const item: { value: any; expires?: number } = { value };
    if (expireInSeconds) {
      item.expires = Date.now() + (expireInSeconds * 1000);
    }
    
    this.cache.set(key, item);
    return true;
  }

  async del(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async delPattern(pattern: string): Promise<boolean> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    const keysToDelete = Array.from(this.cache.keys()).filter(key => regex.test(key));
    keysToDelete.forEach(key => this.cache.delete(key));
    return true;
  }

  async exists(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async ttl(key: string): Promise<number> {
    const item = this.cache.get(key);
    if (!item || !item.expires) return -1;
    return Math.max(0, Math.floor((item.expires - Date.now()) / 1000));
  }

  // Business-specific methods
  async getProducts(filters: any): Promise<any[]> {
    return await this.get(`products:${JSON.stringify(filters)}`);
  }

  async setProducts(filters: any, products: any[], ttl: number = 300): Promise<void> {
    await this.set(`products:${JSON.stringify(filters)}`, products, ttl);
  }

  async getProduct(id: number): Promise<any> {
    return await this.get(`product:${id}`);
  }

  async setProduct(id: number, product: any, ttl: number = 600): Promise<void> {
    await this.set(`product:${id}`, product, ttl);
  }

  async invalidateProduct(id: number): Promise<void> {
    await this.del(`product:${id}`);
    await this.delPattern('products:*');
  }

  async getUserCart(userId: number): Promise<any> {
    return await this.get(`cart:${userId}`);
  }

  async setUserCart(userId: number, cart: any, ttl: number = 3600): Promise<void> {
    await this.set(`cart:${userId}`, cart, ttl);
  }

  async invalidateUserCart(userId: number): Promise<void> {
    await this.del(`cart:${userId}`);
  }

  async getUserSession(sessionId: string): Promise<any> {
    return await this.get(`session:${sessionId}`);
  }

  async setUserSession(sessionId: string, session: any, ttl: number = 3600): Promise<void> {
    await this.set(`session:${sessionId}`, session, ttl);
  }

  async invalidateUserSession(sessionId: string): Promise<void> {
    await this.del(`session:${sessionId}`);
  }

  async getAdminStats(): Promise<any> {
    return await this.get('admin:stats');
  }

  async setAdminStats(stats: any, ttl: number = 300): Promise<void> {
    await this.set('admin:stats', stats, ttl);
  }

  async invalidateAdminStats(): Promise<void> {
    await this.del('admin:stats');
    await this.delPattern('admin:*');
  }

  async getCategories(): Promise<any[]> {
    return await this.get('categories');
  }

  async setCategories(categories: any[], ttl: number = 1800): Promise<void> {
    await this.set('categories', categories, ttl);
  }

  async invalidateCategories(): Promise<void> {
    await this.del('categories');
  }

  // Rate limiting
  private rateLimitCounters: Map<string, { count: number; resetTime: number }> = new Map();

  async checkRateLimit(identifier: string, maxRequests: number, windowInSeconds: number): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const now = Date.now();
    const key = `rate_limit:${identifier}`;
    let counter = this.rateLimitCounters.get(key);

    if (!counter || now > counter.resetTime) {
      counter = {
        count: 1,
        resetTime: now + (windowInSeconds * 1000)
      };
      this.rateLimitCounters.set(key, counter);
    } else {
      counter.count++;
    }

    const remaining = Math.max(0, maxRequests - counter.count);
    
    return {
      allowed: counter.count <= maxRequests,
      remaining,
      resetTime: counter.resetTime
    };
  }

  async decrementRateLimit(identifier: string): Promise<void> {
    const key = `rate_limit:${identifier}`;
    const counter = this.rateLimitCounters.get(key);
    if (counter && counter.count > 0) {
      counter.count--;
    }
  }

  async isHealthy(): Promise<boolean> {
    return this.enabled;
  }

  async disconnect(): Promise<void> {
    this.cache.clear();
    this.rateLimitCounters.clear();
  }
}

// Export singleton instance
export const cacheService = new SimpleCacheService();
export default cacheService;
