import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface CustomErrorType {
    data: {
        message: string,
        status: string,
    }
    status: number
}

export const rtkApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers) => {
            headers.set('Authorization', import.meta.env.VITE_SKILLA_TOKEN)
            return headers
        },
    }) as
        BaseQueryFn<string | FetchArgs, unknown, CustomErrorType, object>,
    tagTypes: [],
    refetchOnReconnect: true,
    endpoints: () => ({}),
})
