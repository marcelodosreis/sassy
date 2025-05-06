import React from 'react';

interface InputProps {
    label: string;
    type: string;
    name: string;
    required?: boolean;
    className?: string;
    placeholder?: string;
    readOnly?: boolean;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputComponent(props: InputProps) {
    return (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-gray-700">
                {props.label}
            </label>
            <input
                type={props.type}
                name={props.name}
                id={props.name}
                required={props.required}
                readOnly={props.readOnly}
                value={props.value}
                onChange={props.onChange}
                className={`text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${props.className}`}
                placeholder={props.placeholder}
            />
        </div>
    );
}