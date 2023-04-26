import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const appointmentsApi = createApi({
    reducerPath: 'appointments',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API}),
    endpoints: (builder) => ({
        getAllAppointments: builder.query({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/project/${payload.projectId}/tasks/search`,
                body: payload,
                method: 'POST'
            })
        }),
        setAppointments: builder.mutation({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/appointments`,
                body: payload.appointments,
                method: 'POST'
            })
        }),
        setManualAppointment: builder.mutation({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/appointments/new`,
                body: payload.appointments,
                method: 'POST'
            })
        }),
        getMyAppointments: builder.mutation({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/appointments/my-appointments`,
                body: payload.appointments,
                method: 'POST'
            })
        }),
        editMyAppointment: builder.mutation({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/appointments/${payload.appointmentId}`,
                body: payload.appointments,
                method: 'PATCH'
            })
        }),
        deleteAppointment: builder.mutation({
            query: (payload) => ({
                headers: {
                    authorization: `Bearer ${payload.token}`
                },
                url: `/v1/appointments/${payload.appointmentId}`,
                method: 'DELETE'
            }),
        }),
    })
})

export const { useGetAllAppointmentsQuery, useSetAppointmentsMutation, useGetMyAppointmentsMutation, useEditMyAppointmentMutation, useSetManualAppointmentMutation, useDeleteAppointmentMutation } = appointmentsApi