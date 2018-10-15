export default interface IServiceFetcher {
  fetch(url: string, options?: any): Promise<any>
}
