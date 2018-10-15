import EnvironmentHelper from './EnvironmentHelper'

describe('EnvironmentHelper', () => {
  test('returns existing values from process.env', () => {
    expect(EnvironmentHelper.get('NODE_ENV')).toEqual('test')
  })

  test('throws when trying to access a non-existing values on process.env', () => {
    expect(() => EnvironmentHelper.get('NOT_EXISTING')).toThrow(
      `missing env variable: 'NOT_EXISTING'`
    )
  })
})
