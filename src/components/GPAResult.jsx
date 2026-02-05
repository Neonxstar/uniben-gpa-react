import { getClassification } from '../utils/gradePoints';
import './GPAResult.css';

/**
 * GPAResult - Displays GPA/CGPA results
 * Shows primary value with optional forecasted prediction
 */
export function GPAResult({
    label = 'Your GPA',
    value = 0,
    forecastedValue = null,
    units = 0,
    points = 0,
    showClassification = false,
}) {
    const classification = showClassification ? getClassification(value) : null;
    const hasForecast = forecastedValue !== null && forecastedValue !== value;

    return (
        <div className="gpa-result">
            {/* Primary GPA display */}
            <div className="gpa-result__primary">
                <span className="gpa-result__label">{label}</span>
                <span className="gpa-result__value">{value.toFixed(2)}</span>

                {/* Classification badge */}
                {classification && (
                    <span
                        className="gpa-result__class"
                        style={{ color: classification.color }}
                    >
                        {classification.name}
                    </span>
                )}
            </div>

            {/* Forecasted prediction */}
            {hasForecast && (
                <div className="gpa-result__forecast">
                    <span className="gpa-result__forecast-label">Predicted</span>
                    <span className="gpa-result__forecast-value">
                        {forecastedValue.toFixed(2)}
                    </span>
                </div>
            )}

            {/* Secondary stats */}
            <div className="gpa-result__stats">
                <div className="gpa-result__stat">
                    <span className="gpa-result__stat-label">Units</span>
                    <span className="gpa-result__stat-value">{units}</span>
                </div>
                <div className="gpa-result__stat">
                    <span className="gpa-result__stat-label">Points</span>
                    <span className="gpa-result__stat-value">
                        {typeof points === 'number' ? points.toFixed(0) : points}
                    </span>
                </div>
            </div>
        </div>
    );
}
