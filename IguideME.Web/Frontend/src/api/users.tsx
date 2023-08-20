import apiClient from "./axios"
import { User } from "@/types/user"


export let getUsers: () => Promise<User[]> = () => apiClient.get(
    `students`
  ).then(response => response.data)

export let getSelf: () => Promise<User> = () => apiClient.get(
    `app/self`
  ).then(response => response.data)
