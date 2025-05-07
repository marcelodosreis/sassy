interface ButtonProps {
    type: 'button' | 'submit' | 'reset';
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
    isLoading?: boolean;
    variant?: 'filled' | 'outlined';
    color?: 'indigo' | 'blue' | 'green' | 'red';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}

const ButtonComponent: React.FC<ButtonProps> = ({
    type,
    className = '',
    onClick,
    children,
    isLoading = false,
    variant = 'filled',
    color = 'indigo',
    size = 'medium',
    disabled = false,
}) => {
    const baseStyles = 'py-2 px-4 border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-offset-2';
    
    const variantStyles = {
        filled: `bg-${color}-600 text-white hover:bg-${color}-700 border-transparent`,
        outlined: `text-${color}-600 border-${color}-600 hover:bg-${color}-100`,
    };
    
    const sizeStyles = {
        small: 'text-sm py-1 px-3',
        medium: 'text-base py-2 px-4',
        large: 'text-lg py-3 px-6',
    };

    const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${
        isLoading || disabled ? 'cursor-not-allowed opacity-50' : ''
    }`;

    const loadingIconColor = variant === 'filled' ? 'text-white' : `text-${color}-600`;

    return (
        <button
            type={type}
            className={buttonStyles}
            onClick={!isLoading && !disabled ? onClick : undefined}
            disabled={isLoading || disabled}
        >
            <div className="flex items-center justify-center space-x-2">
                {isLoading ? (
                    <svg className={`animate-spin h-5 w-5 ${loadingIconColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                ) : (
                    children
                )}
            </div>
        </button>
    );
};

export default ButtonComponent;
