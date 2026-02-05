/**
 * Motivational Messages Library
 * Context-aware messages based on GPA thresholds and forecast scenarios
 */

// GPA threshold messages
const THRESHOLD_MESSAGES = {
    atRisk: [
        "Don't give up—every semester is a fresh start.",
        "Focus on small wins; one better grade can make a big difference.",
        "Progress is progress, no matter how small.",
    ],
    average: [
        "You're building momentum—keep aiming higher.",
        "Consistency will push you into the honors zone.",
        "Each course is an opportunity to improve.",
    ],
    strong: [
        "One more A will boost your GPA above 3.5.",
        "You're on track for honors—stay focused.",
        "Great work! Keep up the excellent performance.",
    ],
    excellent: [
        "Outstanding work—you're in the top tier!",
        "Keep pushing—you're on track for distinction.",
        "Excellence is a habit, and you've mastered it!",
    ],
};

// Forecast-specific messages
const FORECAST_MESSAGES = {
    improvement: [
        "Your effort is paying off—future GPA looks brighter.",
        "You're trending upward—keep the momentum going!",
    ],
    decline: [
        "Stay alert—raising one grade can reverse this trend.",
        "Small adjustments now can prevent bigger setbacks later.",
    ],
    targetReached: [
        "Congratulations—you've hit your academic goal!",
        "Target achieved! Time to set a new goal.",
    ],
};

/**
 * Get GPA threshold category
 * @param {number} gpa - Current GPA
 * @returns {string} Category key
 */
export function getGPACategory(gpa) {
    if (gpa < 2.0) return 'atRisk';
    if (gpa < 3.0) return 'average';
    if (gpa < 3.5) return 'strong';
    return 'excellent';
}

/**
 * Get random message from array
 * @param {Array} messages - Array of messages
 * @returns {string} Random message
 */
function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get motivational message based on context
 * @param {Object} params - Message parameters
 * @param {number} params.gpa - Current GPA
 * @param {number} params.forecastChange - Change from forecast (positive = improvement)
 * @param {boolean} params.targetReached - Whether target GPA is reached
 * @returns {Object} Message object with text and type
 */
export function getMotivationalMessage({ gpa, forecastChange = 0, targetReached = false }) {
    // Priority: target reached > forecast change > threshold
    if (targetReached) {
        return {
            text: getRandomMessage(FORECAST_MESSAGES.targetReached),
            type: 'success',
        };
    }

    if (forecastChange > 0.1) {
        return {
            text: getRandomMessage(FORECAST_MESSAGES.improvement),
            type: 'positive',
        };
    }

    if (forecastChange < -0.1) {
        return {
            text: getRandomMessage(FORECAST_MESSAGES.decline),
            type: 'warning',
        };
    }

    // Fall back to threshold-based message
    const category = getGPACategory(gpa);
    return {
        text: getRandomMessage(THRESHOLD_MESSAGES[category]),
        type: category === 'atRisk' ? 'warning' : category === 'excellent' ? 'success' : 'info',
    };
}

/**
 * Get classification details for a GPA
 * @param {number} gpa - GPA value
 * @returns {Object} Classification with name, color, and progress
 */
export function getClassificationDetails(gpa) {
    if (gpa >= 4.5) {
        return { name: 'First Class', color: '#16a34a', progress: 100, emoji: '🏆' };
    }
    if (gpa >= 3.5) {
        return { name: 'Second Class Upper', color: '#2563eb', progress: 85, emoji: '🌟' };
    }
    if (gpa >= 2.5) {
        return { name: 'Second Class Lower', color: '#ca8a04', progress: 65, emoji: '📈' };
    }
    if (gpa >= 1.5) {
        return { name: 'Third Class', color: '#ea580c', progress: 45, emoji: '💪' };
    }
    if (gpa >= 1.0) {
        return { name: 'Pass', color: '#dc2626', progress: 25, emoji: '🎯' };
    }
    return { name: 'Fail', color: '#7f1d1d', progress: 10, emoji: '📚' };
}
