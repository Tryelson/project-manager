import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const contractsApi = createApi({
    reducerPath: 'contractsApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API}),
    endpoints: (builder) => ({
        getContract: builder.query({
            query: (token) => ({
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                url: '/v1/contract',
                method: 'GET'
            })
        }),
    })
})

export const { useGetContractQuery } = contractsApi