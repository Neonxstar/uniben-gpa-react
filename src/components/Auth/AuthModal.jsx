import { useState } from 'react';
import { FaTimes, FaGraduationCap } from 'react-icons/fa';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
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

    if (!isOpen) return null;

    return (
        <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="auth-card">
                <button className="auth-card__close" onClick={onClose} aria-label="Close">
                    <FaTimes />
                </button>

                <div className="auth-header">
                    <div className="auth-header__logo">
                        <FaGraduationCap />
                    </div>
                    <h2 className="auth-header__title">
                        {mode === 'login' ? 'Welcome back!' : 'Create account'}
                    </h2>
                    <p className="auth-header__subtitle">
                        {mode === 'login'
                            ? 'Sign in to UNIBEN GPA Calculator'
                            : 'Track your GPA with style'}
                    </p>
                </div>

                {mode === 'login' ? (
                    <LoginForm onSwitch={toggleMode} onSuccess={handleSuccess} />
                ) : (
                    <SignupForm onSwitch={toggleMode} onSuccess={handleSuccess} />
                )}
            </div>
        </div>
    );
}
