import ArrowSvg from '~/assets/icons/arrow-button.svg?react';
import CrossSvg from '~/assets/icons/cross.svg?react';
import { clsx } from 'clsx';
import './CustomButton.scss';
import { CustomButtonIconsEnum, CustomButtonTypesEnum } from '~/components/CustomButton/CustomButton.types.ts';
import { useMemo } from 'react';

interface ICustomButtonProps {
    onClick?: () => void;
    direction?: CustomButtonTypesEnum;
    icon: CustomButtonIconsEnum;
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    active?: boolean;
}

const CustomButton = (props: ICustomButtonProps) => {
    const {
        onClick,
        direction = CustomButtonTypesEnum.TOP,
        className,
        children,
        icon,
        disabled,
        active,
    } = props;

    const IconBody = useMemo(() => {
        switch (icon) {
            case CustomButtonIconsEnum.ARROW: {
                return (
                    <ArrowSvg
                        className={clsx('arrow-button__icon', `arrow-button__icon--${direction}`, { 'disabled': disabled, 'active': active })}/>
                );
            }
            case CustomButtonIconsEnum.CROSS: {
                return (
                    <div className="arrow-button__icon--cross">
                        <CrossSvg className={clsx({ 'disabled': disabled })}/>
                    </div>
                );
            }
        }
    }, [direction, disabled, icon]);

    return (
        <button
            className={clsx(className, 'arrow-button')}
            onClick={() => {
                if (onClick) onClick();
            }}
            type="button"
        >
            {children && <span>{children}</span>}
            {IconBody}
        </button>
    );
};

export default CustomButton;