import { useCallback, useEffect, useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import './CallLogTable.scss';
import { callsTypes } from '~/components/CallLogTable/helpers.ts';
import { IDropdownItem } from '~/components/Dropdown/Dropdown.types.ts';
import { CallLogEntryType } from '~/components/CallLogTable/CallLogTable.types.ts';
import { ICallRequest } from '~/shared/api/skilla.types.ts';
import { useFetchCallsMutation } from '~/shared/api/skilla.ts';
import CallLogFilters from '~/components/CallLogTable/components/CallLogFilters/CallLogFilters.tsx';
import CallLogTableUI from '~/components/CallLogTable/components/CallLogTableUI/CallLogTableUI.tsx';
import { useCallLogData } from '~/components/CallLogTable/hooks/useCallLogData';
import { useCallLogColumns } from '~/components/CallLogTable/hooks/useCallLogColumns.tsx';
import DatePicker from '~/components/DatePicker/DatePicker.tsx';
import { DatePickerDateType } from '~/components/DatePicker/DatePicker.types.ts';
import { fetchDate } from '~/shared/lib/fetchDate.ts';

const CallLogTable = () => {
    const [fetchCalls, { data: callsData, isLoading }] = useFetchCallsMutation();

    const [isCallsFilterOpen, setCallsFilterOpen] = useState(false);
    const [selectedCallType, setSelectedCallType] = useState<IDropdownItem>(callsTypes[0]);
    const [selectedDate, setSelectedDate] = useState<DatePickerDateType>({startDate: fetchDate().subtract(3, 'days').toDate(), endDate: new Date()});

    const data: CallLogEntryType[] = useCallLogData(callsData);
    const columns = useCallLogColumns();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const sorting = table.getState().sorting;

    useEffect(() => {
        let options: ICallRequest = {
            date_start: fetchDate(selectedDate.startDate).format('YYYY-MM-DD'),
            date_end: fetchDate(selectedDate.endDate).format('YYYY-MM-DD'),
        };

        if (selectedCallType.value !== 'Все типы') {
            const in_out = () => {
                switch (selectedCallType.value) {
                    case 'Исходящие':
                        return 0;
                    case 'Входящие':
                        return 1;
                    default:
                        return undefined;
                }
            };
            options = {
                ...options,
                in_out: in_out(),
            };
        }

        if (sorting?.length) {
            options = {
                ...options,
                sort_by: sorting[0].id,
                order: sorting[0].desc ? 'DESC' : 'ASC',
            };
        }

        fetchCalls(options);
    }, [fetchCalls, selectedCallType, selectedDate, sorting]);

    const handleFilterToggle = useCallback((value?: boolean) => {
        setCallsFilterOpen((prev) => {
            if (value !== undefined) return value;
            return !prev;
        });
    }, []);
    const handleFilterReset = useCallback(() => setSelectedCallType({ value: 'Все типы', key: 'Все типы' }), []);
    const handleSelectFilter = useCallback((item: IDropdownItem) => setSelectedCallType(item), []);
    const handleSelectDate = useCallback((item: DatePickerDateType) => setSelectedDate(item), []);

    return (
        <div className="call-log-container">
            <div className="call-log-header">
                <CallLogFilters
                    isOpen={isCallsFilterOpen}
                    selectedCallType={selectedCallType}
                    onToggle={handleFilterToggle}
                    onSelect={handleSelectFilter}
                    onReset={handleFilterReset}
                />
                <DatePicker
                    onSelect={handleSelectDate}
                />
            </div>
            <CallLogTableUI
                table={table}
                isLoading={isLoading}
            />
        </div>
    );
};

export default CallLogTable;