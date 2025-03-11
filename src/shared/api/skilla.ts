import { rtkApi } from '../config/rtkApi.ts';
import { ICallRequest, IFetchCallsResponse } from '~/shared/api/skilla.types.ts';

const urlMango = import.meta.env.VITE_SKILLA_API_URL + 'mango';

const skillaApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        fetchCalls: build.mutation<IFetchCallsResponse, ICallRequest>({
            query: (params) => {
                return ({
                    method: 'POST',
                    url: urlMango + '/getList',
                    params,
                });
            },
        }),
        fetchCallRecord: build.mutation<string, {record: string, partnership_id: string}>({
            query: (params) => {
                return ({
                    method: 'POST',
                    url: urlMango + '/getRecord',
                    params,
                    responseHandler: async (response) => {
                        const blob = await response.blob();
                        return URL.createObjectURL(blob);
                    },
                });
            },
        }),
    }),
});

export const {
    useFetchCallRecordMutation,
    useFetchCallsMutation,
} = skillaApi;
