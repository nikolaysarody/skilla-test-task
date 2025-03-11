import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import ArrowCall from '~/components/ArrowCall/ArrowCall.tsx';
import CustomButton from '~/components/CustomButton/CustomButton.tsx';
import { CustomButtonIconsEnum, CustomButtonTypesEnum } from '~/components/CustomButton/CustomButton.types.ts';
import Avatar from '~/components/Avatar/Avatar.tsx';
import StatusRate from '~/components/StatusRate/StatusRate.tsx';
import AudioPlayer from '~/components/AudioPlayer/AudioPlayer.tsx';
import { StatusRateTypesEnum } from '~/components/StatusRate/StatusRate.types.ts';
import { CallLogEntryType } from '~/components/CallLogTable/CallLogTable.types.ts';
import { clsx } from 'clsx';

export const useCallLogColumns = () => {
    const columnHelper = createColumnHelper<CallLogEntryType>();

    const columns = useMemo(() => [
        columnHelper.accessor('type', {
            header: 'Тип',
            cell: info => <ArrowCall type={info.getValue()}/>,
            size: 1,
        }),
        columnHelper.accessor('date', {
            header: ({ column }) => (
                <div
                    className="call-log-table__header-cell pointer"
                    onClick={() => column.toggleSorting()}
                    role={'button'}
                >
                    <span>Время</span>
                    <CustomButton
                        direction={
                            column.getIsSorted() === 'asc'
                                ? CustomButtonTypesEnum.TOP
                                : CustomButtonTypesEnum.BOTTOM
                        }
                        icon={CustomButtonIconsEnum.ARROW}
                        active={Boolean(column.getIsSorted())}
                    />
                </div>
            ),
            size: 1,
        }),
        columnHelper.accessor('employee', {
            header: 'Сотрудник',
            cell: info => <Avatar source={info.getValue().avatar} name={info.getValue().name}/>,
            size: 100,
        }),
        columnHelper.accessor('phone', {
            header: 'Звонок',
            cell: info => {
                const { title, description } = info.getValue();
                return (
                    <div className="call-log-table__phone-cell">
                        {title && (
                            <span className="call-log-table__phone-cell__title">
                                {title}
                            </span>
                        )}
                        <span
                            className={clsx('call-log-table__phone-cell__description', { 'call-log-table__phone-cell__description--without-title': !title })}
                        >
                            {description}
                        </span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('source', {
            header: 'Источник',
            cell: info => <span className="call-log-table__source">{info.getValue()}</span>,
        }),
        columnHelper.accessor('rating', {
            header: 'Оценка',
            cell: info => {
                const rate = info.getValue();
                if (!Object.values(StatusRateTypesEnum).includes(rate as StatusRateTypesEnum)) {
                    return <span className="call-log-table__no-script">{rate}</span>;
                }
                return <StatusRate rate={rate as StatusRateTypesEnum}/>;
            },
        }),
        columnHelper.accessor('duration', {
            header: ({ column }) => (
                <div
                    className="call-log-table__header-cell right pointer"
                    onClick={() => column.toggleSorting()}
                    role={'button'}
                >
                    <span>Длительность</span>
                    <CustomButton
                        direction={
                            column.getIsSorted() === 'asc'
                                ? CustomButtonTypesEnum.TOP
                                : CustomButtonTypesEnum.BOTTOM
                        }
                        icon={CustomButtonIconsEnum.ARROW}
                        active={Boolean(column.getIsSorted())}
                    />
                </div>
            ),
            cell: info => {
                const call = info.getValue();
                if (call && call.record) {
                    return (
                        <div className="call-log-table__audio__container">
                            <AudioPlayer
                                audioId={info.row.id}
                                record={call.record}
                                partnership_id={call.partnership_id}
                                className="call-log-table__audio__player"
                            />
                            <div className="call-log-table__audio__duration">{call.duration}</div>
                        </div>
                    );
                }
            },
        }),
    ], [columnHelper]);

    return columns;
};
