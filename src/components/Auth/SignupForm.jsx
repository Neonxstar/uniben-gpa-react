import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaEnvelope, FaLock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
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

export function SignupForm({ onSwitch, onSuccess }) {
    const { signUp, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword) return;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError(null);

        const { data, error } = await signUp(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            if (data?.user?.identities?.length === 0) {
                setError('An account with this email already exists');
                setLoading(false);
            } else {
                setSuccess(true);
                setLoading(false);
                if (data?.session) {
                    onSuccess?.();
                }
            }
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
    };

    if (success) {
        return (
            <div className="auth-success">
                <div className="auth-success__icon">
                    <FaCheckCircle />
                </div>
                <h3 className="auth-success__title">Check your email!</h3>
                <p className="auth-success__text">
                    We've sent a confirmation link to <strong>{email}</strong>
                </p>
                <div className="auth-switch">
                    Already confirmed?
                    <button type="button" className="auth-switch__link" onClick={onSwitch}>
                        Sign in
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
                <div className="auth-error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            <div className="auth-field">
                <label className="auth-field__label" htmlFor="signup-email">
                    Email address
                </label>
                <div className="auth-field__input-wrapper">
                    <FaEnvelope className="auth-field__icon" />
                    <input
                        id="signup-email"
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
                <label className="auth-field__label" htmlFor="signup-password">
                    Password
                </label>
                <div className="auth-field__input-wrapper">
                    <FaLock className="auth-field__icon" />
                    <input
                        id="signup-password"
                        className="auth-field__input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        autoComplete="new-password"
                        minLength={6}
                    />
                    <div className="auth-field__glow" />
                </div>
            </div>

            <div className="auth-field">
                <label className="auth-field__label" htmlFor="signup-confirm">
                    Confirm password
                </label>
                <div className="auth-field__input-wrapper">
                    <FaLock className="auth-field__icon" />
                    <input
                        id="signup-confirm"
                        className="auth-field__input"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
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
                    {loading ? 'Creating account...' : 'Create Account'}
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
                Already have an account?
                <button type="button" className="auth-switch__link" onClick={onSwitch}>
                    Sign in
                </button>
            </div>
        </form>
    );
}
