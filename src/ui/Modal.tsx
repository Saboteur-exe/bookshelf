import React from 'react';

interface ModalProps {
    title: string;
    message: string;
    onClose: () => void;
    isError?: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, message, onClose, isError = false }) => {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'var(--bg3)',
                border: `1px solid ${isError ? '#8b2020' : 'var(--accent)'}`,
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '420px',
                width: '90%',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{isError ? '⚠️' : 'ℹ️'}</div>
                <h3 style={{ color: isError ? '#e57373' : 'var(--accent)', margin: '0 0 12px' }}>{title}</h3>
                <p style={{ color: 'var(--fg2)', marginBottom: '24px', lineHeight: 1.6 }}>{message}</p>
                <button
                    onClick={onClose}
                    style={{
                        background: isError ? '#8b2020' : 'var(--accent)',
                        color: isError ? '#fff' : 'var(--accent-dark)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 28px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: 600
                    }}
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default Modal;
