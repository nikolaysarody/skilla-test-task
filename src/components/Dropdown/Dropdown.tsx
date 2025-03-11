import { useRef, useState } from 'react';
import './Dropdown.scss';
import { clsx } from 'clsx';
import { IDropdownItem } from '~/components/Dropdown/Dropdown.types.ts';

interface DropdownProps {
    onSelect: (item: IDropdownItem) => void;
    selectedItem?: string;
    items: IDropdownItem[];
    isOpen: boolean;
    onClose: () => void;
    direction?: 'left' | 'right';
}

const Dropdown = (props: DropdownProps) => {
    const {
        onSelect,
        onClose,
        selectedItem,
        isOpen,
        items,
        direction = 'right',
    } = props;
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useState(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    return (
        <div className="dropdown" ref={dropdownRef}>
            {isOpen && (
                <div className={clsx('dropdown__menu', `dropdown__menu--${direction}`,)}>
                    {items.map((item) => (
                        <div
                            className={clsx('dropdown__item', { 'dropdown__item--active': selectedItem === item.key })}
                            onClick={() => {
                                onSelect(item);
                            }}
                            key={item.key}
                        >
                            <span>{item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;