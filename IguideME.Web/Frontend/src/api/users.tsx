import apiClient from "./axios"
import { User } from "@/types/user"


export let getusers: Promise<User[]> = apiClient.get(
    `students`
  ).then(response => response.data)

  export let getself: Promise<User> = apiClient.get(
    `app/self`
  ).then(response => response.data)
