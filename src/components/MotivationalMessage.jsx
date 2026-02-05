import { FaStar, FaExclamationTriangle, FaCheckCircle, FaLightbulb, FaRocket, FaTrophy } from 'react-icons/fa';
import { getMotivationalMessage } from '../utils/motivationalMessages';
import './MotivationalMessage.css';

/**
 * MotivationalMessage - Displays context-aware motivational messages with styled icons
 */
export function MotivationalMessage({ gpa, forecastChange = 0, targetReached = false }) {
    const { text, type } = getMotivationalMessage({ gpa, forecastChange, targetReached });

    // Select icon based on message type
    const getIcon = () => {
        if (targetReached) return FaTrophy;
        if (type === 'success') return FaCheckCircle;
        if (type === 'positive') return FaStar;
        if (type === 'warning') return FaExclamationTriangle;
        if (gpa >= 3.5) return FaRocket;
        return FaLightbulb;
    };

    // Get color based on type
    const getColor = () => {
        if (targetReached) return '#2E7D32';
        if (type === 'success') return '#2E7D32';
        if (type === 'positive') return '#4CAF50';
        if (type === 'warning') return '#FF9800';
        if (gpa < 2.0) return '#F44336';
        if (gpa < 3.0) return '#2196F3';
        return '#4CAF50';
    };

    const Icon = getIcon();
    const color = getColor();

    return (
        <div className={`motivational-message motivational-message--${type}`} style={{ '--message-color': color }}>
            <span className="motivational-message__icon">
                <Icon />
            </span>
            <span className="motivational-message__text">{text}</span>
        </div>
    );
}
