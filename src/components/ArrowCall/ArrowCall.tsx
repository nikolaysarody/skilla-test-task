import ArrowSvg from '~/assets/icons/arrow-call.svg?react';
import { clsx } from 'clsx';
import { ArrowCallTypesEnum } from '~/components/ArrowCall/ArrowCall.types.ts';
import './ArrowCall.scss';

interface IArrowCallProps {
    type: ArrowCallTypesEnum;
    className?: string;
}

const ArrowCall = (props: IArrowCallProps) => {
    const {
        type,
        className,
    } = props;

    return (
        <ArrowSvg className={clsx('arrow-call', `arrow-call--${type}`, className)}/>
    );
};

export default ArrowCall;