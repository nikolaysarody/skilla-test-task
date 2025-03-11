export interface IFetchCallsResponse {
    total_rows: 1;
    results: CallType[];
}

export type CallType = {
    id: string;
    partnership_id: string;
    partner_data: {
        id: string,
        name: string,
        phone: string,
    };
    date: string;
    date_notime: string;
    time: number;
    from_number: string;
    from_extension: string;
    to_number: string;
    to_extension: string;
    is_skilla: boolean;
    status: 'Дозвонился' | 'Не дозвонился';
    record: string;
    line_number: string;
    line_name: string;
    in_out: 0 | 1;
    from_site: boolean;
    source: string;
    errors: {
        title: string,
    }[];
    disconnect_reason: string;
    result: ICallResult[];
    stages: ICallStages[];
    abuse: ICallAbuse;
    contact_name: string;
    contact_company: string;
    person_id: string;
    person_name: string;
    person_surname: string;
    person_avatar: string;
}

interface ICallResult {
    type: 'is_new' | 'message' | 'order' | 'preorder';
    title: string;
    tooltip: string;
}

interface ICallStages {
    person_name: string;
    person_surname: string;
    person_mango_phone: string;
    duration: number;
    disconnect_reason: string;
}

interface ICallAbuse {
    date: string;
    person_name: string;
    message: string;
    support_read_status: boolean;
    support_answer_status: boolean;
    answers: {
        message: string,
        from_support: boolean,
        support_read_status: boolean,
        person_read_status: boolean,
    }[];
}

export interface ICallRequest {
    date_start: string
    date_end: string
    in_out?: 1 | 0
    limit?: number
    offset?: number
    sort_by?: string
    order?: 'ASC' | 'DESC'
    status?: 'success' | 'fail'
    from_type?: ('clients' | 'new_clients' | 'workers' | 'app')[]
    from_persons?: string[]
    sources?: ('from_site' | 'yandex' | 'google' | 'empty' | string)[]
    gte?: number
    lte?: number
    errors?: ('noerrors' | 'noscript' | 'timeover' | 'notavailable' | 'noanswer' | 'subscribercompleted')[]
    results?: ('order' | 'message' | 'preorder' | 'candidate' | 'candidateMessage')[]
    search?: string
    ids?: string[]
    xls?: 1 | undefined
}