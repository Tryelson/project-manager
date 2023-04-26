import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCookie } from 'cookies-next'
import { LoginResponseDto } from '../domain/user'

function buildPostMutation(endpoint: string){
    return {
        query: (token: string) => ({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            url: endpoint,
            method: 'POST'
        }),
    }
}

export const userApi = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API}),
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (token) => ({
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                url: '/v1/me',
                method: 'GET'
            })
        }),
        setRefreshUserToken: builder.mutation({
            ...buildPostMutation('/v1/jwt/refresh'),

            transformResponse(response: LoginResponseDto) {
                setCookie('auth_token', response.data.token)
            },
        }),
        setUser: builder.mutation({
            query: (data) => {
                return {
                    url: "/v1/login",
                    method: 'post',
                    body: data
                }
            },
            transformResponse(response: LoginResponseDto) {
                setCookie('auth_token', response.data.token)
            },
        }),
        setRecoveryPassword: builder.mutation({
            query: (data) => {
                return {
                    url: "/v1/recover-password",
                    method: 'post',
                    body: data
                }
            }
        }),
        setResetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: "/v1/reset-password",
                    method: 'post',
                    body: data
                }
            }
        }),
        getAllUsers: builder.query({
            query: (token) => {
                return {
                    headers: {
                        authorization: `Bearer ${token}`
                    },
                    url: "/v1/user"
                }
            }
        })
    })
})

export const { useGetUserQuery, useLazyGetAllUsersQuery, useSetUserMutation, useSetRecoveryPasswordMutation, useSetResetPasswordMutation, useSetRefreshUserTokenMutation } = userApi