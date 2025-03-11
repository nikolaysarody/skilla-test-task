import { useMemo } from 'react';
import { fetchDate, secondToTime } from '~/shared/lib/fetchDate.ts';
import { buildCallInfo, getCallType, ratings } from '~/components/CallLogTable/helpers.ts';
import { CallLogEntryType } from '~/components/CallLogTable/CallLogTable.types.ts';
import { IFetchCallsResponse } from '~/shared/api/skilla.types.ts';

export const useCallLogData = (callsData?: IFetchCallsResponse): CallLogEntryType[] => {
    return useMemo(() => {
        if (!callsData) return [];

        return callsData.results.map((call) => {
            const callType = getCallType(call.in_out, call.status);
            return {
                id: call.id,
                type: callType,
                date: fetchDate(call.date).format('HH:mm'),
                employee: {
                    avatar: call.person_avatar,
                    name: `${call.person_name[0].toUpperCase()}${call.person_surname[0].toUpperCase()}`,
                },
                phone: buildCallInfo(callType, call),
                source: call.source,
                rating: !call.errors.length
                    ? ratings[Math.floor(Math.random() * ratings.length)]
                    : call.errors.join('\n'),
                duration: call.time
                    ? {
                        duration: secondToTime(call.time),
                        record: call.record,
                        partnership_id: call.partnership_id,
                    }
                    : undefined,
            };
        });
    }, [callsData]);
};
