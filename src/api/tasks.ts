import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const tasksApi = createApi({
    reducerPath: 'tasks',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API}),
    endpoints: (builder) => ({
        getTasks: builder.query({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/project/tasks/${payload.projectId}`,
                method: 'GET'
            })
        }),
        getTaskType: builder.query({
            query: (token) => ({
                headers: {
                    authorization: `Bearer ${token}`
                },
                url: `/v1/tasktype`
            })
        }),
        getTaskAppointments: builder.query({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/task/details/${payload.taskId}`,
                method: 'GET'
            })
        }),
        createNewTask: builder.mutation({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/project/${payload.newTaskPayload.project_id}/tasks`,
                body: payload.newTaskPayload,
                method: 'POST'
            })
        }),
        verifyActiveAppointment: builder.query({
            query: (token) => ({
                headers: {
                    authorization: `Bearer ${token}`
                },
                url: `v1/task/active-task`,
                method: 'GET'
            })
        }),
        updateTask: builder.mutation({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/task/${payload.updateTask.id}`,
                body: payload.updateTask,
                method: 'PATCH'
            })
        }),
        deleteTask: builder.mutation({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/task/${payload.taskId}`,
                method: 'DELETE'
            })
        })
    })
})

export const { useLazyGetTasksQuery, useLazyGetTaskTypeQuery, useLazyGetTaskAppointmentsQuery,useCreateNewTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation, useLazyVerifyActiveAppointmentQuery } = tasksApi