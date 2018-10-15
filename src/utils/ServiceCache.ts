interface ICacheEntry {
  data: any
  lastUpdated: number
}

export default class ServiceCache {
  public static DEFAULT_TTL = 1800000
  private cache: Map<string, ICacheEntry> = new Map()

  constructor(private timeToLive: number = ServiceCache.DEFAULT_TTL) {}

  public set(key: string, data: any): void {
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

    if (Date.now() - lastUpdated >= this.timeToLive) {
      return null
    }

    return data
  }
}
