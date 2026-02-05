import { useState } from 'react';
import './SemesterInput.css';

/**
 * SemesterInput - Form for adding/editing semesters
 */
export function SemesterInput({ onSubmit, initialData = null, onCancel }) {
    const [name, setName] = useState(initialData?.name || '');
    const [units, setUnits] = useState(initialData?.units || '');
    const [gpa, setGpa] = useState(initialData?.gpa || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !units || !gpa) return;

        onSubmit({
            name: name.trim(),
            units: parseInt(units, 10),
            gpa: parseFloat(gpa),
        });

        // Reset form if not editing
        if (!initialData) {
            setName('');
            setUnits('');
            setGpa('');
        }
    };

    return (
        <form className="semester-input" onSubmit={handleSubmit}>
            <div className="semester-input__field">
                <label htmlFor="semester-name">Semester name</label>
                <input
                    id="semester-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 100 Level, First Semester"
                    required
                />
            </div>

            <div className="semester-input__row">
                <div className="semester-input__field">
                    <label htmlFor="semester-units">Total units</label>
                    <input
                        id="semester-units"
                        type="number"
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                        placeholder="e.g. 18"
                        min="1"
                        max="50"
                        required
                    />
                </div>

                <div className="semester-input__field">
                    <label htmlFor="semester-gpa">GPA</label>
                    <input
                        id="semester-gpa"
                        type="number"
                        value={gpa}
                        onChange={(e) => setGpa(e.target.value)}
                        placeholder="e.g. 4.25"
                        min="0"
                        max="5"
                        step="0.01"
                        required
                    />
                </div>
            </div>

            <div className="semester-input__actions">
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
