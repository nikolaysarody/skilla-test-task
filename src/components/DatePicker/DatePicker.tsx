import Dropdown from '~/components/Dropdown/Dropdown.tsx';
import { memo, useCallback, useEffect, useState } from 'react';
import CustomDateOption from '~/components/DatePicker/CustomDateOption/CustomDateOption.tsx';
import { IDropdownItem } from '~/components/Dropdown/Dropdown.types.ts';
import './DatePicker.scss';
import { CustomButtonIconsEnum, CustomButtonTypesEnum } from '~/components/CustomButton/CustomButton.types.ts';
import CustomButton from '~/components/CustomButton/CustomButton.tsx';
import { DatePickerDateType } from '~/components/DatePicker/DatePicker.types.ts';
import { fetchDate } from '~/shared/lib/fetchDate.ts';
import { ManipulateType } from 'dayjs';
import CalendarSvg from '~/assets/icons/calendar.svg?react';

const timeMap: Record<string, {amount: number; unit: ManipulateType}> = {
    '3 дня': { amount: 3, unit: 'day' },
    'Неделя': { amount: 1, unit: 'week' },
    'Месяц': { amount: 1, unit: 'month' },
    'Год': { amount: 1, unit: 'year' },
};

const timeKeys = Object.keys(timeMap);

interface IDatePickerProps {
    onSelect: (item: DatePickerDateType) => void;
}

const DatePicker = memo((props: IDatePickerProps) => {
    const {
        onSelect,
    } = props;

    const [selectedItem, setSelectedItem] = useState<string>('3 дня');
    const [start, setStart] = useState<Date>();
    const [end, setEnd] = useState<Date>();
    const [isOpen, setIsOpen] = useState(false);

    const handleSetTime = (item: string) => {
        setSelectedItem(item);

        if (item === 'Указать даты' && start && end) {
            onSelect({
                startDate: start,
                endDate: end,
            });
            return
        }

        const period = timeMap[item];
        if (period) {
            onSelect({
                startDate: fetchDate().subtract(period.amount, period.unit).toDate(),
                endDate: new Date(),
            });
        }
    };

    const handleToggle = useCallback((value?: boolean) => {
        setIsOpen((prev) => {
            if (value !== undefined) return value;
            return !prev;
        });
    }, []);

    const onToggle = (direction: 'left' | 'right') => {
        setSelectedItem((prev) => {
            const currentIndex = timeKeys.indexOf(prev);
            if (currentIndex === -1) return prev;

            const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

            if (newIndex < 0 || newIndex >= timeKeys.length) {
                return prev;
            }

            handleSetTime(timeKeys[newIndex]);

            return timeKeys[newIndex];
        });
    };

    const options: IDropdownItem[] = [
        {
            value: <span>3 дня</span>,
            key: '3 дня',
        },
        {
            value: <span>Неделя</span>,
            key: 'Неделя',
        },
        {
            value: <span>Месяц</span>,
            key: 'Месяц',
        },
        {
            value: <span>Год</span>,
            key: 'Год',
        },
        {
            value: <CustomDateOption
                values={{ startDate: start, endDate: end }}
                onStartChange={(startDate) => setStart(startDate)}
                onEndChange={(endDate) => setEnd(endDate)}
            />,
            key: 'Указать даты',
        },
    ];

    useEffect(() => {
        if (start && end) {
            onSelect({
                startDate: start,
                endDate: end,
            });
        }
    }, [start, end, onSelect]);

    return (
        <div className="date-picker">
            <CustomButton
                direction={CustomButtonTypesEnum.LEFT}
                icon={CustomButtonIconsEnum.ARROW}
                disabled={timeKeys.indexOf(selectedItem) === 0}
                onClick={() => onToggle('left')}
            />
            <button
                className="date-picker__title-button"
                type="button"
                onClick={() => handleToggle()}
            >
                <CalendarSvg/>
                <span className="date-picker__title">{selectedItem}</span>
            </button>
            <CustomButton
                direction={CustomButtonTypesEnum.RIGHT}
                icon={CustomButtonIconsEnum.ARROW}
                disabled={timeKeys.indexOf(selectedItem) === timeKeys.length - 1}
                onClick={() => onToggle('right')}
            />
            <Dropdown
                onSelect={(item) => handleSetTime(item.key)}
                onClose={() => handleToggle(false)}
                isOpen={isOpen}
                items={options}
                selectedItem={selectedItem}
                direction={'left'}
            />
        </div>
    );
});

export default DatePicker;