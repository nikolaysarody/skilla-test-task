import { StatusRateTypesEnum } from '~/components/StatusRate/StatusRate.types.ts';
import { useMemo } from 'react';
import { clsx } from 'clsx';
import './StatusRate.scss';

interface IStatusRateProps {
    rate: StatusRateTypesEnum;
    className?: string;
}

const StatusRate = (props: IStatusRateProps) => {
    const {
        rate,
        className,
    } = props;

    const status = useMemo(() => {
        switch (rate) {
            case StatusRateTypesEnum.BAD: {
                return 'Плохо';
            }
            case StatusRateTypesEnum.EXCELLENT: {
                return 'Отлично';
            }
            case StatusRateTypesEnum.GOOD: {
                return 'Хорошо';
            }
            default: {
                return 'Ошибка';
            }
        }
    }, [rate]);

    return (
        <div className={clsx(className, 'status-rate', `status-rate--${rate}`)}>
            {status}
        </div>
    );
};

export default StatusRate;