export interface IProps {
  mergedData: MergedData[]
}

export type MergedData = {
  grade1: string,
  grade2: string,
  user_login_id: string
}