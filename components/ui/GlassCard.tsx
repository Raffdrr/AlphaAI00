import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    onClick,
    noPadding = false
}) => {
    return (
        <div
            onClick={onClick}
            className={`
        glass-card 
        ${noPadding ? '' : 'p-6'} 
        ${onClick ? 'cursor-pointer' : ''} 
        ${className}
      `}
        >
            {children}
        </div>
    );
};
