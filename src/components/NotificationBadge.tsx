import React from 'react';

interface NotificationBadgeProps {
    count: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
    if (count <= 0) return null;

    return (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white shadow-sm px-1 animate-in fade-in zoom-in duration-300">
            {count > 99 ? '99+' : count}
            <span className="absolute -z-10 w-full h-full rounded-full bg-red-400 animate-ping opacity-75"></span>
        </span>
    );
};

export default NotificationBadge;
