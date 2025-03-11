import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { useAppDispatch } from "common/hooks"
import { useChangeFilterTasks } from "../../../../../../hooks/useChangeFilterTasks"
import { todolistsApi } from "../../../../api/todolistsApi"
import { DomainTodolist, FilterValues } from "../../../../lib/types/types"
import { filterButtonsContainerSx } from "./FilterTasksButtons.styles"

type Props = {
  todolist: DomainTodolist
}

export const FilterTasksButtons = ({ todolist }: Props) => {
  const { filter, id } = todolist
  
 const { changeFilterTasksHandler } = useChangeFilterTasks(id)
  
  //const dispatch = useAppDispatch()

  // const changeFilterTasksHandler = (filter: FilterValues) => {
  //   dispatch(
  //     todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
  //       const index = state.findIndex((tl) => tl.id === id)
  //       if (index !== -1) {
  //         state[index].filter = filter
  //       }
  //     }),
  //   )
  // }

  return (
    <Box sx={filterButtonsContainerSx}>
      <Button
        variant={filter === "all" ? "outlined" : "text"}
        color={"inherit"}
        onClick={() => changeFilterTasksHandler("all")}
      >
        All
      </Button>
      <Button
        variant={filter === "active" ? "outlined" : "text"}
        color={"primary"}
        onClick={() => changeFilterTasksHandler("active")}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "outlined" : "text"}
        color={"secondary"}
        onClick={() => changeFilterTasksHandler("completed")}
      >
        Completed
      </Button>
    </Box>
  )
}
