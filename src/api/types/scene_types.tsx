export interface ISceneParams {
  limit: number
  page: number
  po: {
    projectDbId: string
  }
}
export interface ISceneItem {
  dbId: string
  createTime: string
  createUser: string
  updateTime: string
  updateUser: string
  sceneName: string
  imgUrl: string
  projectDbId: string
}
