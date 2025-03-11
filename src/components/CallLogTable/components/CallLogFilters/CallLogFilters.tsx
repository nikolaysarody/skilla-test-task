import CustomButton from '~/components/CustomButton/CustomButton.tsx';
import Dropdown from '~/components/Dropdown/Dropdown.tsx';
import { clsx } from 'clsx';
import { IDropdownItem } from '~/components/Dropdown/Dropdown.types.ts';
import { CustomButtonIconsEnum, CustomButtonTypesEnum } from '~/components/CustomButton/CustomButton.types.ts';
import { callsTypes } from '~/components/CallLogTable/helpers.ts';
import './CallLogFilters.scss';
import { memo } from 'react';

interface ICallLogFiltersProps {
    isOpen: boolean;
    selectedCallType: IDropdownItem;
    onToggle: (value?: boolean) => void;
    onSelect: (item: IDropdownItem) => void;
    onReset: () => void;
}

const CallLogFilters = memo((props: ICallLogFiltersProps) => {
    const {
        isOpen,
        selectedCallType,
        onToggle,
        onSelect,
        onReset,
    } = props;

    return (
        <div className="filter-section">
            <CustomButton
                direction={isOpen ? CustomButtonTypesEnum.BOTTOM : CustomButtonTypesEnum.TOP}
                className={clsx('filter-section__filter-btn', { 'filter-section__filter-btn--active': selectedCallType.value !== 'Все типы' })}
                icon={CustomButtonIconsEnum.ARROW}
                onClick={onToggle}
            >
                {selectedCallType.value}
            </CustomButton>
            {selectedCallType.value !== 'Все типы' && (
                <CustomButton
                    className="filter-section__filter-btn"
                    icon={CustomButtonIconsEnum.CROSS}
                    onClick={onReset}
                >
                    Сбросить фильтры
                </CustomButton>
            )}
            <Dropdown
                onSelect={onSelect}
                items={callsTypes}
                isOpen={isOpen}
                onClose={() => onToggle(false)}
                selectedItem={selectedCallType.key}
            />
        </div>
    );
});

export default CallLogFilters;
