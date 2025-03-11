import './CustomDateOption.scss';
import { useRef, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { clsx } from 'clsx';
import { fetchDate } from '~/shared/lib/fetchDate.ts';
import { toast } from 'react-toastify';
import CalendarSvg from '~/assets/icons/calendar.svg?react';

interface CustomDateOptionProps {
    values: {
        startDate?: Date;
        endDate?: Date;
    };
    onStartChange: (startDate?: Date) => void;
    onEndChange: (endDate?: Date) => void;
}

const CustomDateOption = (props: CustomDateOptionProps) => {
    const {
        values,
        onStartChange,
        onEndChange,
    } = props;

    const [activeInput, setActiveInput] = useState<'START' | 'END' | null>(null);

    const calendarRef = useRef<HTMLDivElement | null>(null);
    const inputStartRef = useRef<HTMLInputElement | null>(null);
    const inputEndRef = useRef<HTMLInputElement | null>(null);

    const handleClickDay = (date: Date) => {
        if (activeInput === 'START') {
            if (values.endDate && fetchDate(date).isAfter(values.endDate)) {
                toast('Начальная дата не может быть позже конечной', { type: 'error' });
            } else {
                onStartChange(date);
            }
        } else {
            if (values.startDate && fetchDate(date).isBefore(values.startDate)) {
                toast('Конечная дата не может быть раньше начальной', { type: 'error' });
            } else {
                onEndChange(date);
            }
        }
    };

    const handleInputClick = (type: 'START' | 'END') => {
        setActiveInput(type);

        const currentRef = type === 'START' ? inputStartRef : inputEndRef;

        if (currentRef.current && calendarRef.current) {
            const rect = inputStartRef.current!.getBoundingClientRect();
            calendarRef.current.style.top = `${rect.bottom + window.scrollY}px`;
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
            setActiveInput(null);
        }
    };

    useState(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    return (
        <>
            <span className="custom-date-option__title">Указать даты</span>
            <div className="custom-date-option__container">
                <input
                    ref={inputStartRef}
                    type="text"
                    placeholder="__.__.__"
                    onClick={() => handleInputClick('START')}
                    value={values.startDate ? fetchDate(values.startDate).format('DD.MM.YY') : ''}
                    className={clsx('custom-date-option__input', { 'custom-date-option__input--active': activeInput === 'START' })}
                    readOnly
                />
                <p className="custom-date-option__separator">-</p>
                <input
                    ref={inputEndRef}
                    type="text"
                    placeholder="__.__.__"
                    onClick={() => handleInputClick('END')}
                    value={values.endDate ? fetchDate(values.endDate).format('DD.MM.YY') : ''}
                    className={clsx('custom-date-option__input', { 'custom-date-option__input--active': activeInput === 'END' })}
                    readOnly
                />
                <CalendarSvg className="custom-date-option__icon"/>
                <div
                    ref={calendarRef}
                    className={clsx('custom-date-option__calendar', { 'custom-date-option__calendar--open': activeInput })}
                >
                    <Calendar
                        locale="ru-RU"
                        minDetail="month"
                        maxDetail="month"
                        value={activeInput === 'START' ? values.startDate : values.endDate}
                        onClickDay={handleClickDay}
                        next2Label={null}
                        prev2Label={null}
                    />
                </div>
            </div>
        </>
    );
};

export default CustomDateOption;