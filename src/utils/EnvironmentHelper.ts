const environment: Map<string, string> = new Map(Object.entries(process.env))

class EnvironmentHelper {
  public static get(key: string): string {
    const value = environment.get(key)

    if (value === undefined) {
      throw new Error(`missing env variable: '${key}'`)
    }

    return value
  }
}

export default EnvironmentHelper
