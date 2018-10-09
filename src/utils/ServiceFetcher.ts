import * as got from 'got'
import ServiceCache from './ServiceCache'

class ServiceFetcher {
  constructor(private cache: ServiceCache = new ServiceCache()) {}

  public async fetch(url: string, options: any): Promise<any> {
    const cacheData = this.cache.get(url)

    if (cacheData) {
      return cacheData
    }

    const gotOptions = {
      json: true,
      ...options,
      headers: {
        ...options.headers,
        'User-Agent': 'https://github.com/paderbornjs/api',
      },
    }

    const { body } = await got(url, gotOptions)
    this.cache.set(url, body)

    return body
  }
}

export default ServiceFetcher
