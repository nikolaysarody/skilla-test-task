import dayjs from '~/shared/config/dayjsConfig.ts';

export const fetchDate = (date?: string | Date) => {
    return dayjs(date);
};

export const secondToTime = (time: number) => {
    return dayjs.duration(time, 'second').format('mm:ss');
};