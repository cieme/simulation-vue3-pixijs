export interface IResponse<T> {
  code: number
  msg: string
  data: T
}
export interface IListResult<T> extends IResponse<any> {
  data: {
    current: number // 当前页数
    pages: number // 总页数
    size: number // 当前条数
    total: number // 总条数
    records: T
  }
}
