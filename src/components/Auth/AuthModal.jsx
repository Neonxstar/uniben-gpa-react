import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { Modal } from '../Modal';
import './Auth.css';

export function AuthModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'

    const handleSuccess = () => {
        onClose();
        setMode('login'); // Reset to login for next time
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'login' ? 'Welcome back!' : 'Create your account'}
        >
            {mode === 'login' ? (
                <LoginForm onSwitch={toggleMode} onSuccess={handleSuccess} />
            ) : (
                <SignupForm onSwitch={toggleMode} onSuccess={handleSuccess} />
            )}
        </Modal>
    );
}
