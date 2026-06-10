import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    loading?: boolean;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    loading = false,
    fullWidth = false,
    disabled,
    style,
    ...rest
}) => {
    const base: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 22px',
        borderRadius: '8px',
        border: 'none',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        fontWeight: 600,
        transition: 'all 0.2s',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled || loading ? 0.6 : 1
    };

    const variants: Record<string, React.CSSProperties> = {
        primary:   { background: 'var(--accent)', color: 'var(--accent-dark)' },
        secondary: { background: 'var(--card-bg)', color: 'var(--accent)', border: '1px solid var(--accent)' },
        danger:    { background: '#8b2020', color: '#fff' },
        ghost:     { background: 'transparent', color: 'var(--accent)', border: '1px solid var(--border)' }
    };

    return (
        <button style={{ ...base, ...variants[variant], ...style }} disabled={disabled || loading} {...rest}>
            {loading && (
                <span style={{
                    width: 14,
                    height: 14,
                    border: '2px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                }} />
            )}
            {children}
        </button>
    );
};

export default Button;
