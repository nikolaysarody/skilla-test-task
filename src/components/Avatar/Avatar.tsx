import './Avatar.scss';
import { useMemo } from 'react';
import NoAvatar from '~/assets/icons/no-avatar.svg';

interface IAvatarProps {
    source: string | null;
    name: string;
}

const Avatar = (props: IAvatarProps) => {
    const { source, name } = props;

    const avatarImage = useMemo(() => {
        if (source === 'https://lk.skilla.ru/img/noavatar.jpg') {
            return NoAvatar;
        }
        return source;
    }, [source]);

    return (
        <div className="avatar">
            {source ? (
                <img src={String(avatarImage)} alt={name}/>
            ) : (
                <span className="avatar__name">{name}</span>
            )}
        </div>
    );
};

export default Avatar;