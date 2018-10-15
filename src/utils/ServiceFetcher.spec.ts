import * as got from 'got'
import ServiceFetcher from './ServiceFetcher'

jest.mock('got', () => jest.fn().mockImplementation(() => ({ body: 'body' })))

describe('ServiceFetcher', () => {
  test('returns cache hits', async () => {
    const get = jest.fn().mockImplementation(() => ({ foo: 'bar' }))
    const fetcher = new ServiceFetcher({ set: jest.fn(), get })
    const result = await fetcher.fetch('https://example.com/resource')

    expect(get).toHaveBeenCalledTimes(1)
    expect(get).toHaveLastReturnedWith({ foo: 'bar' })
    expect(result).toEqual({ foo: 'bar' })
  })

  test('invokes got', async () => {
    const fetcher = new ServiceFetcher({ get: jest.fn(), set: jest.fn() })
    await fetcher.fetch('https://example.com/resource')

    expect(got).toHaveBeenCalledWith('https://example.com/resource', {
      headers: { 'User-Agent': 'https://github.com/paderbornjs/api' },
      json: true,
    })
  })

  test('saves results in cache', async () => {
    const set = jest.fn()
    const fetcher = new ServiceFetcher({ get: jest.fn(), set })
    await fetcher.fetch('https://example.com/resource')

    expect(set).toHaveBeenCalledWith('https://example.com/resource', 'body')
  })

  test('merges options and headers', async () => {
    const fetcher = new ServiceFetcher()
    await fetcher.fetch('https://example.com/resource2', {
      foo: 'bar',
      headers: { baz: 'qux' },
    })

    expect(got).toHaveBeenCalledWith('https://example.com/resource2', {
      foo: 'bar',
      headers: {
        baz: 'qux',
        'User-Agent': 'https://github.com/paderbornjs/api',
      },
      json: true,
    })
  })
})
