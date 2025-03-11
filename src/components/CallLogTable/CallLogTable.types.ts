import { ArrowCallTypesEnum } from '~/components/ArrowCall/ArrowCall.types.ts';
import { StatusRateTypesEnum } from '~/components/StatusRate/StatusRate.types.ts';

export interface IEmployee {
    name: string;
    avatar: string | null;
}

export interface ICallRecord {
    duration: string;
    record?: string;
    partnership_id: string;
}

export interface ICallContact {
    title?: string;
    description: string;
}

export type CallLogEntryType = {
    id: string;
    type: ArrowCallTypesEnum;
    date: string;
    employee: IEmployee;
    phone: ICallContact;
    source: string;
    rating: StatusRateTypesEnum | string;
    duration?: ICallRecord;
}