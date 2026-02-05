import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import './Auth.css';

export function LoginForm({ onSwitch, onSuccess }) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
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

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
                <div className="auth-form__error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            <div className="auth-form__field">
                <label htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                />
            </div>

            <div className="auth-form__field">
                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                />
            </div>

            <button
                type="submit"
                className="auth-form__submit"
                disabled={loading}
            >
                {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="auth-form__switch">
                Don't have an account?
                <button type="button" onClick={onSwitch}>
                    Sign up
                </button>
            </div>
        </form>
    );
}
