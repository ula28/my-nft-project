import { TaskStatus } from "common/enums"
import { useState } from "react"
import { useGetTasksQuery } from "../features/todolists/api/tasksApi"
import { DomainTodolist } from "../features/todolists/lib/types/types"





export const useTasks = ( todolist: DomainTodolist) => {
  
  const [page, setPage] = useState(1)
  
  const { data, isLoading } = useGetTasksQuery({ todolistId: todolist.id, args: { page } })
  
  let tasksForTodolist = data?.items
  
  if (todolist.filter === "active") {
    tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.New)
  }
  
  if (todolist.filter === "completed") {
    tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.Completed)
  }
  
  return {isLoading,setPage,page,data,tasksForTodolist}
}