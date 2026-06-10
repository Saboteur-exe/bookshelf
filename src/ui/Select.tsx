import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    error?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, id, style, ...rest }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            {label && (
                <label htmlFor={id} style={{ fontSize: '0.85rem', color: 'var(--fg3)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {label}
                </label>
            )}
            <select
                id={id}
                style={{
                    border: `1px solid ${error ? '#e57373' : 'var(--border)'}`,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box' as const,
                    cursor: 'pointer',
                    ...style,
                }}
                {...rest}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <span style={{ fontSize: '0.8rem', color: '#e57373' }}>{error}</span>}
        </div>
    );
};

export default Select;
