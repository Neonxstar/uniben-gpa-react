import { useState } from 'react';
import { GRADE_OPTIONS, CREDIT_OPTIONS } from '../utils/gradePoints';
import './CourseInput.css';

/**
 * CourseInput - Form for adding/editing courses
 * Supports both actual and forecasted courses
 */
export function CourseInput({
    onSubmit,
    initialData = null,
    isForecasted = false,
    onCancel,
}) {
    const [name, setName] = useState(initialData?.name || '');
    const [creditUnit, setCreditUnit] = useState(initialData?.creditUnit || '');
    const [grade, setGrade] = useState(initialData?.grade || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !creditUnit || !grade) return;

        onSubmit({
            name: name.trim(),
            creditUnit: parseInt(creditUnit, 10),
            grade,
        });

        // Reset form if not editing
        if (!initialData) {
            setName('');
            setCreditUnit('');
            setGrade('');
        }
    };

    return (
        <form className="course-input" onSubmit={handleSubmit}>
            {isForecasted && (
                <div className="course-input__badge">Forecasted</div>
            )}

            <div className="course-input__field">
                <label htmlFor="course-name">Course code</label>
                <input
                    id="course-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. MTH 101"
                    required
                />
            </div>

            <div className="course-input__row">
                <div className="course-input__field">
                    <label htmlFor="credit-unit">Units</label>
                    <select
                        id="credit-unit"
                        value={creditUnit}
                        onChange={(e) => setCreditUnit(e.target.value)}
                        required
                    >
                        <option value="">Select</option>
                        {CREDIT_OPTIONS.map((unit) => (
                            <option key={unit} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="course-input__field">
                    <label htmlFor="grade">{isForecasted ? 'Expected grade' : 'Grade'}</label>
                    <select
                        id="grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        required
                    >
                        <option value="">Select</option>
                        {GRADE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="course-input__actions">
                {onCancel && (
                    <button type="button" className="btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                )}
                <button type="submit" className="btn-primary">
                    {initialData ? 'Update' : 'Add'}
                </button>
            </div>
        </form>
    );
}
