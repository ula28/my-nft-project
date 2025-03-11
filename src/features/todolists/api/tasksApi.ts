import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { baseApi } from "../../../app/baseApi"
import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"

export const COUNT_TASKS=4

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, {todolistId:string, args:{page:number}}>({
      query: ({todolistId,args}) => {
        return {
          url: `todo-lists/${todolistId}/tasks`,
          params: {...args,count:COUNT_TASKS}
        }
      },
      providesTags:(result,error,{todolistId} )=>
        result ? [{type:"Task",id:todolistId}]:["Task"]
    }),
  
    removeTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => {
        return {
          method: "DELETE",
          url: `todo-lists/${todolistId}/tasks/${taskId}`,
        }
      },
      // invalidatesTags: ["Task"],
      invalidatesTags: (result,error,{todolistId})=>
          [{type:"Task", id:todolistId}],
    }),
    addTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => {
        return {
          method: "POST",
          url: `todo-lists/${todolistId}/tasks`,
          body: {
            title,
          },
        }
      },
     // invalidatesTags: ["Task"],
      invalidatesTags:(result,error,{todolistId})=>
          [{type:"Task", id:todolistId}],
    }),
    
    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => {
        return {
          method: "PUT",
          url: `todo-lists/${todolistId}/tasks/${taskId}`,
          body: model,
        }
      },
      
      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState}) {
        
        const cashedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(getState(),"getTasks")
        
        let patchResults:any[] = []
        
        cashedArgsForQuery.forEach(({args})=>{
          
          patchResults.push(
            dispatch(
                 tasksApi.util.updateQueryData("getTasks", { todolistId,args:{page:args.page}}, (state) => {
                    const task = state.items.find((t) => t.id ===  taskId)
                      if (task) {
                            task.status=model.status
                      }
                 }),
            )
          )
        })
        
        try{
          await  queryFulfilled
        } catch (e) {
          patchResults.forEach( patchResult=>{
            patchResult.undo()
          })
        }
      },
      invalidatesTags: (result,error,{todolistId})=>
        [{type:"Task", id:todolistId}],
    }),
  }),
})

export const { useGetTasksQuery, useAddTaskMutation, useRemoveTaskMutation, useUpdateTaskMutation } = tasksApi

