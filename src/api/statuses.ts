import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const statusesApi = createApi({
    reducerPath: 'statuses',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API}),
    endpoints: (builder) => ({
        getStatuses: builder.query({
            query: (token) => ({
                headers: {
                    authorization: `Bearer ${token}`
                },
                url: `/v1/taskstatus`,
                method: 'GET'
            })
        })
    })
})

export const { useLazyGetStatusesQuery } = statusesApi