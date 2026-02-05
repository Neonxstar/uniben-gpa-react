import './SemesterList.css';

/**
 * SemesterList - Displays list of semesters with edit/delete actions
 */
export function SemesterList({
    semesters = [],
    onEdit,
    onDelete,
}) {
    if (semesters.length === 0) {
        return (
            <div className="semester-list__empty">
                <div className="semester-list__empty-icon">📚</div>
                <p>No semesters yet</p>
                <p className="semester-list__empty-hint">Add your semester results to calculate CGPA</p>
            </div>
        );
    }

    return (
        <div className="semester-list">
            {semesters.map((semester) => (
                <div key={semester.id} className="semester-card">
                    <div className="semester-card__info">
                        <div className="semester-card__name">{semester.name}</div>
                        <div className="semester-card__details">
                            <span>{semester.units} units</span>
                        </div>
                    </div>
                    <div className="semester-card__gpa">
                        <div className="semester-card__gpa-value">{semester.gpa.toFixed(2)}</div>
                        <div className="semester-card__gpa-label">GPA</div>
                    </div>
                    <div className="semester-card__actions">
                        {onEdit && (
                            <button
                                className="action-btn"
                                onClick={() => onEdit(semester)}
                                aria-label="Edit semester"
                            >
                                ✎
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="action-btn action-btn--delete"
                                onClick={() => onDelete(semester.id)}
                                aria-label="Remove semester"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
