import { useState } from 'react';
import { GRADE_OPTIONS, CREDIT_OPTIONS, calculateGPA } from '../utils/gradePoints';
import { MotivationalMessage } from './MotivationalMessage';
import './ForecastTool.css';

/**
 * ForecastTool - Grade forecasting with best/worst case scenarios
 */
export function ForecastTool({
    courses = [],
    forecastedCourses = [],
    onUpdateForecast,
    onAddForecast,
    onClose,
}) {
    // Local state for forecast scenarios
    const [scenarioCourses, setScenarioCourses] = useState(
        forecastedCourses.map((c) => ({ ...c }))
    );
    const [targetGPA, setTargetGPA] = useState(4.0);

    // Calculate scenarios
    const actualGPA = calculateGPA(courses);

    // Current forecast (with user's expected grades)
    const currentForecast = calculateGPA([...courses, ...scenarioCourses]);

    // Best case (all A's for forecasted)
    const bestCase = calculateGPA([
        ...courses,
        ...scenarioCourses.map((c) => ({ ...c, grade: 'A' })),
    ]);

    // Worst case (all F's for forecasted)
    const worstCase = calculateGPA([
        ...courses,
        ...scenarioCourses.map((c) => ({ ...c, grade: 'F' })),
    ]);

    const forecastChange = currentForecast.gpa - actualGPA.gpa;
    const targetReached = currentForecast.gpa >= targetGPA;

    const handleGradeChange = (index, grade) => {
        const updated = [...scenarioCourses];
        updated[index] = { ...updated[index], grade };
        setScenarioCourses(updated);
    };

    const handleSaveForecasts = () => {
        scenarioCourses.forEach((course) => {
            onUpdateForecast(course.id, { grade: course.grade });
        });
        onClose();
    };

    return (
        <div className="forecast-tool">
            {/* Target GPA */}
            <div className="forecast-tool__target">
                <label>
                    <span>Target GPA</span>
                    <input
                        type="number"
                        value={targetGPA}
                        onChange={(e) => setTargetGPA(parseFloat(e.target.value) || 0)}
                        min="0"
                        max="5"
                        step="0.1"
                    />
                </label>
            </div>

            {/* Scenario Cards */}
            <div className="forecast-tool__scenarios">
                <div className="forecast-tool__scenario forecast-tool__scenario--current">
                    <div className="forecast-tool__scenario-label">Current Forecast</div>
                    <div className="forecast-tool__scenario-value">{currentForecast.gpa.toFixed(2)}</div>
                    {targetReached && <span className="forecast-tool__target-badge">🎯 Target!</span>}
                </div>
                <div className="forecast-tool__scenario forecast-tool__scenario--best">
                    <div className="forecast-tool__scenario-label">Best Case</div>
                    <div className="forecast-tool__scenario-value">{bestCase.gpa.toFixed(2)}</div>
                    <span className="forecast-tool__scenario-hint">All A's</span>
                </div>
                <div className="forecast-tool__scenario forecast-tool__scenario--worst">
                    <div className="forecast-tool__scenario-label">Worst Case</div>
                    <div className="forecast-tool__scenario-value">{worstCase.gpa.toFixed(2)}</div>
                    <span className="forecast-tool__scenario-hint">All F's</span>
                </div>
            </div>

            {/* Motivational Message */}
            <MotivationalMessage
                gpa={currentForecast.gpa}
                forecastChange={forecastChange}
                targetReached={targetReached}
            />

            {/* Adjust Grades */}
            {scenarioCourses.length > 0 ? (
                <div className="forecast-tool__courses">
                    <h4>Adjust Expected Grades</h4>
                    {scenarioCourses.map((course, index) => (
                        <div key={course.id} className="forecast-tool__course">
                            <div className="forecast-tool__course-info">
                                <span className="forecast-tool__course-name">{course.name}</span>
                                <span className="forecast-tool__course-units">{course.creditUnit} units</span>
                            </div>
                            <select
                                value={course.grade}
                                onChange={(e) => handleGradeChange(index, e.target.value)}
                                className="forecast-tool__grade-select"
                            >
                                {GRADE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label} ({opt.points} pts)
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="forecast-tool__empty">
                    <p>No forecasted courses yet</p>
                    <button className="forecast-tool__add-btn" onClick={onAddForecast}>
                        + Add Forecasted Course
                    </button>
                </div>
            )}

            {/* Actions */}
            <div className="forecast-tool__actions">
                <button className="btn-secondary" onClick={onClose}>
                    Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveForecasts}>
                    Save Forecast
                </button>
            </div>
        </div>
    );
}
