import React from 'react';
import { useAppSelector, useAppDispatch } from '../utils/hooks';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';
import { closeErrorModal } from '../store/slices/settingsSlice';

interface CommonWrapperProps {
    children: React.ReactNode;
}

const CommonWrapper: React.FC < CommonWrapperProps > = ({ children }) => {
    const dispatch = useAppDispatch();
    const { isLoading, showErrorModal, error, loadingMessage } = useAppSelector(s => s.settings);

    return (
        <> { children } { isLoading && <LoadingSpinner message={loadingMessage} /> } {
            showErrorModal && error && (
                <Modal
          title='Ошибка'
          message={error}
          isError
          onClose={() => dispatch(closeErrorModal())}
        />
            )
        } <
        />
    );
};

export default CommonWrapper;
