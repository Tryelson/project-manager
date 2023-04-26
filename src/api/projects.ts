import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const projectsApi = createApi({
    reducerPath: 'projectsApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API}),
    endpoints: (builder) => ({
        getProject: builder.query({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${data.token}`
                },
                url: `/v1/contract/${data.id}/projects`,
                method: 'GET'
            })
        }),
        getAllProjects: builder.query({
            query: (token) => ({
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                url: `/v1/project`,
                method: 'GET'
            })
        }),
        getSingleProject: builder.query({
            query: (payload) => ({
                headers: {
                    'authorization': `Bearer ${payload.token}`
                },
                url: `/v1/project/${payload.projectId}`,
                method: 'GET'
            })
        })
    })
})

export const { useLazyGetProjectQuery, useGetAllProjectsQuery, useLazyGetSingleProjectQuery } = projectsApi