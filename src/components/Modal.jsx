import { useEffect } from 'react';
import './Modal.css';

/**
 * Modal - Reusable bottom sheet modal
 */
export function Modal({ isOpen, onClose, title, children }) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <h3>{title}</h3>
                    <button className="modal__close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal__content">{children}</div>
            </div>
        </div>
    );
}
