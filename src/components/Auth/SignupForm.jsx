import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import './Auth.css';

export function SignupForm({ onSwitch, onSuccess }) {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
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
            // Check if email confirmation is required
            if (data?.user?.identities?.length === 0) {
                setError('An account with this email already exists');
                setLoading(false);
            } else {
                setSuccess(true);
                setLoading(false);
                // Auto-login if email confirmation is disabled
                if (data?.session) {
                    onSuccess?.();
                }
            }
        }
    };

    if (success) {
        return (
            <div className="auth-form">
                <div className="auth-form__success">
                    <FaCheckCircle />
                    <span>Account created! Check your email to confirm.</span>
                </div>
                <div className="auth-form__switch">
                    Already confirmed?
                    <button type="button" onClick={onSwitch}>
                        Sign in
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
                <div className="auth-form__error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            <div className="auth-form__field">
                <label htmlFor="signup-email">Email</label>
                <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                />
            </div>

            <div className="auth-form__field">
                <label htmlFor="signup-password">Password</label>
                <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    autoComplete="new-password"
                    minLength={6}
                />
            </div>

            <div className="auth-form__field">
                <label htmlFor="signup-confirm">Confirm Password</label>
                <input
                    id="signup-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                />
            </div>

            <button
                type="submit"
                className="auth-form__submit"
                disabled={loading}
            >
                {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <div className="auth-form__switch">
                Already have an account?
                <button type="button" onClick={onSwitch}>
                    Sign in
                </button>
            </div>
        </form>
    );
}
