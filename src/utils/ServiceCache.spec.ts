import ServiceCache from './ServiceCache'

describe('ServiceCache', () => {
  test('returns cached values', () => {
    const cache = new ServiceCache()
    cache.set('foo', 'bar')

    expect(cache.get('foo')).toEqual('bar')
  })

  test('respects timeToLive on get', () => {
    const cache = new ServiceCache(0)
    cache.set('foo', 'bar')

    expect(cache.get('foo')).toBeNull()
  })
})
