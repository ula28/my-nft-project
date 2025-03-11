import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { baseApi } from "../../../app/baseApi"
import { DomainTodolist } from "../lib/types/types"
import { Todolist } from "./todolistsApi.types"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse(todolists: Todolist[]): DomainTodolist[] {
        return todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
      },
      providesTags: ["Todolist"],
    }),
    addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => {
        return {
          url: "todo-lists",
          method: "POST",
          body: { title },
        }
      },
      invalidatesTags: ["Todolist"],
    }),
    removeTodolist: build.mutation<BaseResponse, string>({
      query: (id) => {
        return {
          method: "DELETE",
          url: `todo-lists/${id}`,
        }
      },
     async onQueryStarted(id, { dispatch, queryFulfilled}) {
        const putchResult= dispatch(
          todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
            
            const index = state.findIndex((tl) => tl.id === id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          }),
        )
        try{
              await  queryFulfilled
        } catch (e) {
              putchResult.undo()
        }
      },
      
      invalidatesTags: ["Todolist"],
    }),
    updateTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => {
        return {
          method: "PUT",
          url: `todo-lists/${id}`,
          body: {
            title,
          },
        }
      },
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useRemoveTodolistMutation,
  useUpdateTodolistTitleMutation,
} = todolistsApi


