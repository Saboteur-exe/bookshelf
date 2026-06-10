import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, id, style, ...rest }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            {label && (
                <label htmlFor={id} style={{ fontSize: '0.85rem', color: 'var(--fg3)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {label}
                </label>
            )}
            <input
                id={id}
                style={{
                    border: `1px solid ${error ? '#e57373' : 'var(--border)'}`,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    ...style
                }}
                {...rest}
            />
            {error && <span style={{ fontSize: '0.8rem', color: '#e57373' }}>{error}</span>}
        </div>
    );
};

export default Input;
