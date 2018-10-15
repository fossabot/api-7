export default interface IServiceCache {
  set(key: string, data: any): void
  get(key: string): any
}
