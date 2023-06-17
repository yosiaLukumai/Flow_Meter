import React from 'react';

interface MyProps {
    name: string;
    action?: () => void;
    padding?: string;
    margin?: string;
    style?: React.CSSProperties;
}

const But: React.FC<MyProps> = ({ name, action, padding, margin, style }) => {
    return (
        <button
            style={{ padding, margin, ...style }}
            onClick={action}
        >
            {name}
        </button>
    );
};

export default But;
