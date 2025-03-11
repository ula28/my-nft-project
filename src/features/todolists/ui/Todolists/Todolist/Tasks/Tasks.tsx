import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { useState } from "react"
import { useTasks } from "../../../../../../hooks/useTasks"
import { useGetTasksQuery } from "../../../../api/tasksApi"
import { DomainTodolist } from "../../../../lib/types/types"
import { TasksSkeleton } from "../../../skeletons/TasksSkeleton/TasksSkeleton"
import { Task } from "./Task/Task"
import { TasksPagination } from "../TasksPagination/TasksPagination"

type Props = {
  todolist: DomainTodolist
}


export const Tasks = ({ todolist }:Props) => {
  const {data,isLoading, page,setPage,tasksForTodolist} = useTasks(todolist)

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {tasksForTodolist?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>
            {tasksForTodolist?.map((task) => {
              return <Task key={task.id} task={task} todolist={todolist} />
            })}
          </List>
          <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />
        </>
      )}
    </>
  )
}
