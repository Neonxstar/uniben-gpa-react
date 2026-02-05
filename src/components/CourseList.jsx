import { GRADE_POINTS } from '../utils/gradePoints';
import './CourseList.css';

/**
 * CourseList - Displays list of courses with edit/delete actions
 */
export function CourseList({
    courses = [],
    onEdit,
    onDelete,
    emptyMessage = 'No courses yet',
    emptyHint = 'Add your courses to calculate GPA',
}) {
    if (courses.length === 0) {
        return (
            <div className="course-list__empty">
                <div className="course-list__empty-icon">📋</div>
                <p>{emptyMessage}</p>
                <p className="course-list__empty-hint">{emptyHint}</p>
            </div>
        );
    }

    return (
        <div className="course-list">
            {courses.map((course) => (
                <div
                    key={course.id}
                    className={`course-card ${course.forecasted ? 'course-card--forecasted' : ''}`}
                >
                    <div className="course-card__grade">{course.grade}</div>
                    <div className="course-card__info">
                        <div className="course-card__name">{course.name}</div>
                        <div className="course-card__details">
                            <span>{course.creditUnit} units</span>
                            <span>{GRADE_POINTS[course.grade]} points</span>
                        </div>
                    </div>
                    <div className="course-card__actions">
                        {onEdit && (
                            <button
                                className="action-btn"
                                onClick={() => onEdit(course)}
                                aria-label="Edit course"
                            >
                                ✎
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="action-btn action-btn--delete"
                                onClick={() => onDelete(course.id)}
                                aria-label="Remove course"
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
