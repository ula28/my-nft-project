import { useAppDispatch } from "common/hooks"
import { todolistsApi } from "../features/todolists/api/todolistsApi"
import type { FilterValues } from "../features/todolists/lib/types/types"

export const useChangeFilterTasks = (id: string) => {
  const dispatch = useAppDispatch();
  
  const changeFilterTasksHandler = (filter: FilterValues) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const index = state.findIndex((tl) => tl.id === id);
        if (index !== -1) {
          state[index].filter = filter;
        }
      }),
    );
  };
  
  return { changeFilterTasksHandler };
};