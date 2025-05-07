import React, { useState } from 'react';

type ToggleProps = {
    labels: {
        off: string;
        on: string;
    };
    initialState?: boolean;
    onToggle?: (state: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({ labels, initialState = false, onToggle }) => {
    const [isToggled, setIsToggled] = useState(initialState);

    const handleToggle = () => {
        const newState = !isToggled;
        setIsToggled(newState);
        if (onToggle) {
            onToggle(newState);
        }
    };

    return (
        <div className="flex items-center justify-end mt-6">
            <span
                className={`text-sm font-medium ${isToggled ? 'text-gray-400' : 'text-gray-900'}`}
            >
                {labels.off}
            </span>
            <button
                onClick={handleToggle}
                className={`relative inline-flex items-center h-6 w-12 sm:h-5 sm:w-10 rounded-full ${isToggled ? 'bg-indigo-600' : 'bg-gray-300'} transition-colors duration-200 mx-2`}
            >
                <span
                    className={`inline-block h-5 w-5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform duration-200 ${isToggled ? 'translate-x-6 sm:translate-x-5' : 'translate-x-1'}`}
                />
            </button>
            <span
                className={`text-sm font-medium ${isToggled ? 'text-gray-900' : 'text-gray-400'}`}
            >
                {labels.on}
            </span>
        </div>
    );
};

export default Toggle;
