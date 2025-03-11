import { ArrowCallTypesEnum } from '~/components/ArrowCall/ArrowCall.types.ts';
import { CallType } from '~/shared/api/skilla.types.ts';
import { StatusRateTypesEnum } from '~/components/StatusRate/StatusRate.types.ts';
import { ICallContact } from '~/components/CallLogTable/CallLogTable.types.ts';

export const getCallType = (in_out: 1 | 0, status: 'Дозвонился' | 'Не дозвонился'): ArrowCallTypesEnum => {
    switch (in_out) {
        case 0: {
            return status === 'Дозвонился' ? ArrowCallTypesEnum.OUTGOING : ArrowCallTypesEnum.FAILURE;
        }
        case 1: {
            return status === 'Дозвонился' ? ArrowCallTypesEnum.INCOMING : ArrowCallTypesEnum.MISSED;
        }
    }
};

export const getPhoneFromCall = (callType: ArrowCallTypesEnum, call: CallType) => {
    if (callType === ArrowCallTypesEnum.INCOMING || callType === ArrowCallTypesEnum.MISSED) {
        return call.from_number;
    }
    return call.to_number;
};

export const buildCallInfo = (callType: ArrowCallTypesEnum, call: CallType) => {
    const info = {} as ICallContact;
    if (call.contact_name) {
        info.title = call.contact_name;
    }
    if (call.contact_company) {
        info.description = call.contact_company;
    } else {
        info.description = getPhoneFromCall(callType, call);
    }

    return info;
};

export const ratings = [StatusRateTypesEnum.GOOD, StatusRateTypesEnum.BAD, StatusRateTypesEnum.EXCELLENT];

export const callsTypes = [
    { value: 'Все типы', key: 'Все типы' },
    { value: 'Входящие', key: 'Входящие' },
    { value: 'Исходящие', key: 'Исходящие' },
];

export const datesTypes = [
    { value: '3 дня', key: '3 дня' },
    { value: 'Неделя', key: 'Неделя' },
    { value: 'Месяц', key: 'Месяц' },
    { value: 'Год', key: 'Год' },
];