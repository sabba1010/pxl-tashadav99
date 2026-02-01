import React from 'react';

interface NotificationBadgeProps {
    count: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
    if (count <= 0) return null;

    return (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white shadow-sm px-1">
            {count > 99 ? '99+' : count}
        </span>
    );
};

export default NotificationBadge;
