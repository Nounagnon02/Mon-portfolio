const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, duration = CACHE_DURATION) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      duration
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.duration) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  has(key) {
    return this.get(key) !== null;
  }
}

export const cacheManager = new CacheManager();
