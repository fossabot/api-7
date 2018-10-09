interface CacheEntry {
  data: any
  lastUpdated: number
}

class ServiceCache {
  private cache: Map<string, CacheEntry> = new Map()

  constructor(private timeToLive: number = 1800000) {}

  public set(key: string, data): void {
    this.cache.set(key, {
      data,
      lastUpdated: Date.now(),
    })
  }

  public get(key: string): any {
    if (!this.cache.has(key)) {
      return null
    }

    const { data, lastUpdated } = this.cache.get(key)

    if (Date.now() - lastUpdated > this.timeToLive) {
      return null
    }

    return data
  }
}

export default ServiceCache
