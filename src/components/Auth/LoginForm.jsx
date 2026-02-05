import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import './Auth.css';

// Google Logo SVG Component
const GoogleIcon = () => (
    <svg className="auth-google__icon" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

export function LoginForm({ onSwitch, onSuccess }) {
    const { signIn, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        setError(null);

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            onSuccess?.();
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        setError(null);
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
            setGoogleLoading(false);
        }
        // OAuth will redirect, so no need to handle success here
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
                <div className="auth-error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            <div className="auth-field">
                <label className="auth-field__label" htmlFor="login-email">
                    Email address
                </label>
                <div className="auth-field__input-wrapper">
                    <FaEnvelope className="auth-field__icon" />
                    <input
                        id="login-email"
                        className="auth-field__input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                    />
                    <div className="auth-field__glow" />
                </div>
            </div>

            <div className="auth-field">
                <label className="auth-field__label" htmlFor="login-password">
                    Password
                </label>
                <div className="auth-field__input-wrapper">
                    <FaLock className="auth-field__icon" />
                    <input
                        id="login-password"
                        className="auth-field__input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                    />
                    <div className="auth-field__glow" />
                </div>
            </div>

            <button
                type="submit"
                className="auth-submit"
                disabled={loading}
            >
                <span>
                    {loading && <span className="auth-spinner" />}
                    {loading ? 'Signing in...' : 'Sign In'}
                </span>
            </button>

            <div className="auth-divider">or continue with</div>

            <button
                type="button"
                className="auth-google"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
            >
                {googleLoading ? (
                    <span className="auth-spinner" style={{ borderTopColor: 'var(--text-primary)' }} />
                ) : (
                    <GoogleIcon />
                )}
                {googleLoading ? 'Connecting...' : 'Google'}
            </button>

            <div className="auth-switch">
                Don't have an account?
                <button type="button" className="auth-switch__link" onClick={onSwitch}>
                    Sign up
                </button>
            </div>
        </form>
    );
}
