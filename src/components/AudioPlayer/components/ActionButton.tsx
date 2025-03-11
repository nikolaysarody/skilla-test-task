import './ActionButton.scss';
import PlaySvg from '~/assets/icons/play.svg?react';
import PauseSvg from '~/assets/icons/pause.svg?react';
import { clsx } from 'clsx';
import { BiLoader } from 'react-icons/bi';

interface IActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    actionType: 'play' | 'pause';
    isLoading?: boolean;
}

const ActionButton = (props: IActionButtonProps) => {
    const {
        actionType,
        isLoading,
        ...rest
    } = props;

    return (
        <button
            className={clsx('action-button', props.className)}
            disabled={isLoading}
            {...rest}
        >
            {!isLoading ? actionType === 'pause' ? (
                <PauseSvg/>
            ) : (
                <PlaySvg/>
            ) : (
                <BiLoader size={18} className="action-button__spinner"/>
            )}
        </button>
    );
};

export default ActionButton;